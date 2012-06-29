#!/usr/bin/python
# ***** BEGIN GPL LICENSE BLOCK *****
#
# This file is part of PyOpenNI.
#
# PyOpenNI is free software: you can redistribute it and/or modify
# it under the terms of the GNU Lesser General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# PyOpenNI is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Lesser General Public License for more details.
#
# You should have received a copy of the GNU Lesser General Public License
# along with PyOpenNI.  If not, see <http://www.gnu.org/licenses/>.
#
# PyOpenNI is Copyright (C) 2011, Xavier Mendez (jmendeth).
# OpenNI Python Wrapper (ONIPY) is Copyright (C) 2011, Gabriele Nataneli (gamix).
#
# ***** END GPL LICENSE BLOCK *****

"""
A nice and complete example of OpenNI:

it starts tracking some gestures and alerts you
when they're recognized.
"""

from openni import *
import redis
import json

red = redis.Redis(host='localhost', db=1)
chan_name = "kinect"

pose_to_use = 'Psi'

ctx = Context()
ctx.init()

gest = GestureGenerator()
gest.create(ctx)

#depth = DepthGenerator()
#depth.create(ctx)

# Create the user generator
user = UserGenerator()
user.create(ctx)

# Obtain the skeleton & pose detection capabilities
skel_cap = user.skeleton_cap
pose_cap = user.pose_detection_cap

# Declare the callbacks
def new_user(src, id):
    print "1/4 User {} detected. Looking for pose..." .format(id)
    pose_cap.start_detection(pose_to_use, id)

def pose_detected(src, pose, id):
    print "2/4 Detected pose {} on user {}. Requesting calibration..." .format(pose,id)
    pose_cap.stop_detection(id)
    skel_cap.request_calibration(id, True)

def calibration_start(src, id):
    print "3/4 Calibration started for user {}." .format(id)

def calibration_complete(src, id, status):
    if status == CALIBRATION_STATUS_OK:
        print "4/4 User {} calibrated successfully! Starting to track." .format(id)
        skel_cap.start_tracking(id)
    else:
        print "ERR User {} failed to calibrate. Restarting process." .format(id)
        new_user(user, id)

def lost_user(src, id):
    print "--- User {} lost." .format(id)

# Register them
user.register_user_cb(new_user, lost_user)
pose_cap.register_pose_detected_cb(pose_detected)
skel_cap.register_c_start_cb(calibration_start)
skel_cap.register_c_complete_cb(calibration_complete)

# Set the profile
skel_cap.set_profile(SKEL_PROFILE_ALL)

# Start generating
ctx.start_generating_all()
print "0/4 Starting to detect users. Press Ctrl-C to exit."

while True:
    # Update to next frame
    ctx.wait_and_update_all()

    # Extract head position of each tracked user
    for id in user.users:
        if skel_cap.is_tracking(id):
            #head = skel_cap.get_joint_position(id, SKEL_HEAD)
            #print "  {}: head at ({loc[0]}, {loc[1]}, {loc[2]}) [{conf}]" .format(id, loc=head.point, conf=head.confidence)
            
            for joint_name in [SKEL_LEFT_HAND, SKEL_LEFT_ELBOW, SKEL_RIGHT_HAND, SKEL_RIGHT_ELBOW, SKEL_HEAD, SKEL_LEFT_KNEE, SKEL_RIGHT_KNEE]:#, SKEL_LEFT_KNEE, SKEL_RIGHT_KNEE,SKEL_TORSO, SKEL_WAIST]:
                joint = skel_cap.get_joint_position(id, joint_name)
                #print "  {}: left hand at ({loc[0]}, {loc[1]}, {loc[2]}) [{conf}]" .format(id, loc=hand.point, conf=hand.confidence)
                
                data = json.dumps({"coord": joint.point, "joint": "%s" % joint_name})
                #print data
                red.publish(chan_name, data)

"""        XN_SKEL_HEAD                        = 1, 
        XN_SKEL_NECK                        = 2, 
        XN_SKEL_TORSO                        = 3, 
        XN_SKEL_WAIST                        = 4, 

        XN_SKEL_LEFT_COLLAR                = 5, 
        XN_SKEL_LEFT_SHOULDER        = 6, 
        XN_SKEL_LEFT_ELBOW                = 7, 
        XN_SKEL_LEFT_WRIST                = 8, 
        XN_SKEL_LEFT_HAND                = 9, 
        XN_SKEL_LEFT_FINGERTIP        =10, 

        XN_SKEL_RIGHT_COLLAR        =11, 
        XN_SKEL_RIGHT_SHOULDER        =12, 
        XN_SKEL_RIGHT_ELBOW                =13, 
        XN_SKEL_RIGHT_WRIST                =14, 
        XN_SKEL_RIGHT_HAND                =15, 
        XN_SKEL_RIGHT_FINGERTIP        =16, 

        XN_SKEL_LEFT_HIP                =17, 
        XN_SKEL_LEFT_KNEE                =18, 
        XN_SKEL_LEFT_ANKLE                =19, 
        XN_SKEL_LEFT_FOOT                =20, 

        XN_SKEL_RIGHT_HIP                =21, 
        XN_SKEL_RIGHT_KNEE                =22, 
        XN_SKEL_RIGHT_ANKLE                =23, 
        XN_SKEL_RIGHT_FOOT                =24 
"""