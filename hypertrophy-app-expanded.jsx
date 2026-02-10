import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Play, Check, ChevronRight, ChevronLeft, Plus, Minus, BarChart3, Dumbbell, Calendar, Settings, Home, TrendingUp, Target, Flame, Clock, Award, Info, X, Edit3, RotateCcw, Zap, Heart, Activity, Trash2, Copy, Save, Download, Upload, Cloud, Share2 } from 'lucide-react';
import { useToast, ToastContainer } from './src/components/Toast';
import ConfirmModal from './src/components/ConfirmModal';
import {
  createInitialState,
  calculateSuggestedWeight,
  getBestPerformance,
  formatDuration,
  calculateE1RM,
  getProgressionData as getProgressionDataHelper,
  getOverallVolumeData as getOverallVolumeDataHelper,
  validateImportData,
  getTotalCompletedSets,
  getAverageWorkoutDuration,
} from './src/utils/helpers';

const DEFAULT_EXERCISES = {
  chest: [
    // Barbell
    { id: 'bench_press', name: 'Barbell Bench Press', equipment: 'barbell', primary: 'chest', isCustom: false },
    { id: 'incline_bench_press', name: 'Incline Barbell Bench Press', equipment: 'barbell', primary: 'chest', isCustom: false },
    { id: 'decline_bench_press', name: 'Decline Barbell Bench Press', equipment: 'barbell', primary: 'chest', isCustom: false },
    { id: 'close_grip_bench', name: 'Close Grip Bench Press', equipment: 'barbell', primary: 'chest', isCustom: false },
    { id: 'floor_press', name: 'Floor Press', equipment: 'barbell', primary: 'chest', isCustom: false },
    { id: 'reverse_grip_bench', name: 'Reverse Grip Bench Press', equipment: 'barbell', primary: 'chest', isCustom: false },
    { id: 'wide_grip_bench', name: 'Wide Grip Bench Press', equipment: 'barbell', primary: 'chest', isCustom: false },
    { id: 'pause_bench_press', name: 'Pause Bench Press', equipment: 'barbell', primary: 'chest', isCustom: false },
    { id: 'spoto_press', name: 'Spoto Press', equipment: 'barbell', primary: 'chest', isCustom: false },
    { id: 'larsen_press', name: 'Larsen Press (Feet Up)', equipment: 'barbell', primary: 'chest', isCustom: false },
    { id: 'guillotine_press', name: 'Guillotine Press', equipment: 'barbell', primary: 'chest', isCustom: false },
    // Dumbbell
    { id: 'db_bench_press', name: 'Dumbbell Bench Press', equipment: 'dumbbells', primary: 'chest', isCustom: false },
    { id: 'incline_db_press', name: 'Incline Dumbbell Press', equipment: 'dumbbells', primary: 'chest', isCustom: false },
    { id: 'decline_db_press', name: 'Decline Dumbbell Press', equipment: 'dumbbells', primary: 'chest', isCustom: false },
    { id: 'db_squeeze_press', name: 'Dumbbell Squeeze Press', equipment: 'dumbbells', primary: 'chest', isCustom: false },
    { id: 'db_floor_press', name: 'Dumbbell Floor Press', equipment: 'dumbbells', primary: 'chest', isCustom: false },
    { id: 'neutral_grip_db_press', name: 'Neutral Grip Dumbbell Press', equipment: 'dumbbells', primary: 'chest', isCustom: false },
    { id: 'single_arm_db_press', name: 'Single Arm Dumbbell Press', equipment: 'dumbbells', primary: 'chest', isCustom: false },
    { id: 'alternating_db_press_chest', name: 'Alternating Dumbbell Press', equipment: 'dumbbells', primary: 'chest', isCustom: false },
    { id: 'reverse_grip_db_press', name: 'Reverse Grip Dumbbell Press', equipment: 'dumbbells', primary: 'chest', isCustom: false },
    { id: 'db_fly', name: 'Dumbbell Fly', equipment: 'dumbbells', primary: 'chest', isCustom: false },
    { id: 'incline_db_fly', name: 'Incline Dumbbell Fly', equipment: 'dumbbells', primary: 'chest', isCustom: false },
    { id: 'decline_db_fly', name: 'Decline Dumbbell Fly', equipment: 'dumbbells', primary: 'chest', isCustom: false },
    { id: 'db_pullover', name: 'Dumbbell Pullover', equipment: 'dumbbells', primary: 'chest', isCustom: false },
    { id: 'standing_db_fly', name: 'Standing Dumbbell Fly', equipment: 'dumbbells', primary: 'chest', isCustom: false },
    { id: 'svend_press', name: 'Svend Press', equipment: 'dumbbells', primary: 'chest', isCustom: false },
    // Machine
    { id: 'machine_press', name: 'Machine Chest Press', equipment: 'machine', primary: 'chest', isCustom: false },
    { id: 'incline_machine_press', name: 'Incline Machine Press', equipment: 'machine', primary: 'chest', isCustom: false },
    { id: 'decline_machine_press', name: 'Decline Machine Press', equipment: 'machine', primary: 'chest', isCustom: false },
    { id: 'smith_bench_press', name: 'Smith Machine Bench Press', equipment: 'machine', primary: 'chest', isCustom: false },
    { id: 'smith_incline_press', name: 'Smith Machine Incline Press', equipment: 'machine', primary: 'chest', isCustom: false },
    { id: 'smith_decline_press', name: 'Smith Machine Decline Press', equipment: 'machine', primary: 'chest', isCustom: false },
    { id: 'pec_deck', name: 'Pec Deck Machine', equipment: 'machine', primary: 'chest', isCustom: false },
    { id: 'hammer_strength_press', name: 'Hammer Strength Chest Press', equipment: 'machine', primary: 'chest', isCustom: false },
    { id: 'hammer_incline_press', name: 'Hammer Strength Incline Press', equipment: 'machine', primary: 'chest', isCustom: false },
    { id: 'hammer_decline_press', name: 'Hammer Strength Decline Press', equipment: 'machine', primary: 'chest', isCustom: false },
    { id: 'converging_chest_press', name: 'Converging Chest Press', equipment: 'machine', primary: 'chest', isCustom: false },
    // Cables
    { id: 'cable_fly', name: 'Cable Fly (Mid)', equipment: 'cables', primary: 'chest', isCustom: false },
    { id: 'cable_crossover', name: 'Cable Crossover', equipment: 'cables', primary: 'chest', isCustom: false },
    { id: 'low_cable_fly', name: 'Low to High Cable Fly', equipment: 'cables', primary: 'chest', isCustom: false },
    { id: 'high_cable_fly', name: 'High to Low Cable Fly', equipment: 'cables', primary: 'chest', isCustom: false },
    { id: 'cable_press', name: 'Cable Chest Press', equipment: 'cables', primary: 'chest', isCustom: false },
    { id: 'incline_cable_fly', name: 'Incline Cable Fly', equipment: 'cables', primary: 'chest', isCustom: false },
    { id: 'single_arm_cable_fly', name: 'Single Arm Cable Fly', equipment: 'cables', primary: 'chest', isCustom: false },
    { id: 'cable_iron_cross', name: 'Cable Iron Cross', equipment: 'cables', primary: 'chest', isCustom: false },
    { id: 'lying_cable_fly', name: 'Lying Cable Fly', equipment: 'cables', primary: 'chest', isCustom: false },
    // Bodyweight
    { id: 'push_ups', name: 'Push Ups', equipment: 'bodyweight', primary: 'chest', isCustom: false },
    { id: 'incline_push_ups', name: 'Incline Push Ups', equipment: 'bodyweight', primary: 'chest', isCustom: false },
    { id: 'decline_push_ups', name: 'Decline Push Ups', equipment: 'bodyweight', primary: 'chest', isCustom: false },
    { id: 'diamond_push_ups', name: 'Diamond Push Ups', equipment: 'bodyweight', primary: 'chest', isCustom: false },
    { id: 'wide_push_ups', name: 'Wide Push Ups', equipment: 'bodyweight', primary: 'chest', isCustom: false },
    { id: 'dips', name: 'Chest Dips', equipment: 'bodyweight', primary: 'chest', isCustom: false },
    { id: 'archer_push_ups', name: 'Archer Push Ups', equipment: 'bodyweight', primary: 'chest', isCustom: false },
    { id: 'clap_push_ups', name: 'Clap Push Ups', equipment: 'bodyweight', primary: 'chest', isCustom: false },
    { id: 'ring_push_ups', name: 'Ring Push Ups', equipment: 'bodyweight', primary: 'chest', isCustom: false },
    { id: 'weighted_push_ups', name: 'Weighted Push Ups', equipment: 'bodyweight', primary: 'chest', isCustom: false },
    { id: 'ring_fly', name: 'Ring Fly', equipment: 'bodyweight', primary: 'chest', isCustom: false },
    // Other
    { id: 'landmine_press', name: 'Landmine Press', equipment: 'other', primary: 'chest', isCustom: false },
    { id: 'band_chest_fly', name: 'Resistance Band Chest Fly', equipment: 'other', primary: 'chest', isCustom: false },
    { id: 'band_push_up', name: 'Banded Push Up', equipment: 'other', primary: 'chest', isCustom: false },
    { id: 'plate_squeeze_press', name: 'Plate Squeeze Press', equipment: 'other', primary: 'chest', isCustom: false },
  ],
  back: [
    // Barbell
    { id: 'barbell_row', name: 'Barbell Row', equipment: 'barbell', primary: 'back', isCustom: false },
    { id: 'pendlay_row', name: 'Pendlay Row', equipment: 'barbell', primary: 'back', isCustom: false },
    { id: 'deadlift', name: 'Conventional Deadlift', equipment: 'barbell', primary: 'back', isCustom: false },
    { id: 't_bar_row', name: 'T-Bar Row', equipment: 'barbell', primary: 'back', isCustom: false },
    { id: 'yates_row', name: 'Yates Row (Underhand)', equipment: 'barbell', primary: 'back', isCustom: false },
    { id: 'seal_row', name: 'Seal Row', equipment: 'barbell', primary: 'back', isCustom: false },
    { id: 'rack_pull', name: 'Rack Pull', equipment: 'barbell', primary: 'back', isCustom: false },
    { id: 'deficit_deadlift', name: 'Deficit Deadlift', equipment: 'barbell', primary: 'back', isCustom: false },
    { id: 'snatch_grip_row', name: 'Snatch Grip Barbell Row', equipment: 'barbell', primary: 'back', isCustom: false },
    { id: 'wide_grip_row', name: 'Wide Grip Barbell Row', equipment: 'barbell', primary: 'back', isCustom: false },
    // Dumbbell
    { id: 'db_row', name: 'Dumbbell Row', equipment: 'dumbbells', primary: 'back', isCustom: false },
    { id: 'db_row_supported', name: 'Chest Supported Dumbbell Row', equipment: 'dumbbells', primary: 'back', isCustom: false },
    { id: 'kroc_row', name: 'Kroc Row', equipment: 'dumbbells', primary: 'back', isCustom: false },
    { id: 'renegade_row', name: 'Renegade Row', equipment: 'dumbbells', primary: 'back', isCustom: false },
    { id: 'meadows_row', name: 'Meadows Row', equipment: 'dumbbells', primary: 'back', isCustom: false },
    { id: 'incline_db_row', name: 'Incline Dumbbell Row', equipment: 'dumbbells', primary: 'back', isCustom: false },
    { id: 'two_arm_db_row', name: 'Two Arm Dumbbell Row', equipment: 'dumbbells', primary: 'back', isCustom: false },
    { id: 'db_deadlift', name: 'Dumbbell Deadlift', equipment: 'dumbbells', primary: 'back', isCustom: false },
    { id: 'db_pullover_back', name: 'Dumbbell Pullover (Back)', equipment: 'dumbbells', primary: 'back', isCustom: false },
    { id: 'helms_row', name: 'Helms Row', equipment: 'dumbbells', primary: 'back', isCustom: false },
    { id: 'gorilla_row', name: 'Gorilla Row', equipment: 'dumbbells', primary: 'back', isCustom: false },
    // Machine
    { id: 'lat_pulldown', name: 'Lat Pulldown', equipment: 'machine', primary: 'back', isCustom: false },
    { id: 'close_grip_pulldown', name: 'Close Grip Lat Pulldown', equipment: 'machine', primary: 'back', isCustom: false },
    { id: 'wide_grip_pulldown', name: 'Wide Grip Lat Pulldown', equipment: 'machine', primary: 'back', isCustom: false },
    { id: 'reverse_grip_pulldown', name: 'Reverse Grip Lat Pulldown', equipment: 'machine', primary: 'back', isCustom: false },
    { id: 'neutral_grip_pulldown', name: 'Neutral Grip Lat Pulldown', equipment: 'machine', primary: 'back', isCustom: false },
    { id: 'single_arm_pulldown', name: 'Single Arm Lat Pulldown', equipment: 'machine', primary: 'back', isCustom: false },
    { id: 'behind_neck_pulldown', name: 'Behind Neck Lat Pulldown', equipment: 'machine', primary: 'back', isCustom: false },
    { id: 'machine_row', name: 'Seated Machine Row', equipment: 'machine', primary: 'back', isCustom: false },
    { id: 'chest_supported_row', name: 'Chest Supported Machine Row', equipment: 'machine', primary: 'back', isCustom: false },
    { id: 'assisted_pull_up', name: 'Assisted Pull Up Machine', equipment: 'machine', primary: 'back', isCustom: false },
    { id: 'hammer_strength_row', name: 'Hammer Strength Row', equipment: 'machine', primary: 'back', isCustom: false },
    { id: 'hammer_lat_pull', name: 'Hammer Strength Lat Pull', equipment: 'machine', primary: 'back', isCustom: false },
    { id: 'iso_lateral_row', name: 'Iso-Lateral Row', equipment: 'machine', primary: 'back', isCustom: false },
    { id: 'smith_row', name: 'Smith Machine Row', equipment: 'machine', primary: 'back', isCustom: false },
    { id: 'machine_pullover', name: 'Machine Pullover', equipment: 'machine', primary: 'back', isCustom: false },
    { id: 't_bar_machine', name: 'T-Bar Row Machine', equipment: 'machine', primary: 'back', isCustom: false },
    // Cables
    { id: 'cable_row', name: 'Seated Cable Row', equipment: 'cables', primary: 'back', isCustom: false },
    { id: 'single_arm_cable_row', name: 'Single Arm Cable Row', equipment: 'cables', primary: 'back', isCustom: false },
    { id: 'straight_arm_pulldown', name: 'Straight Arm Pulldown', equipment: 'cables', primary: 'back', isCustom: false },
    { id: 'cable_pullover', name: 'Cable Pullover', equipment: 'cables', primary: 'back', isCustom: false },
    { id: 'wide_cable_row', name: 'Wide Grip Cable Row', equipment: 'cables', primary: 'back', isCustom: false },
    { id: 'close_cable_row', name: 'Close Grip Cable Row', equipment: 'cables', primary: 'back', isCustom: false },
    { id: 'standing_cable_row', name: 'Standing Cable Row', equipment: 'cables', primary: 'back', isCustom: false },
    { id: 'high_row_cable', name: 'High Cable Row', equipment: 'cables', primary: 'back', isCustom: false },
    { id: 'rope_cable_row', name: 'Rope Cable Row', equipment: 'cables', primary: 'back', isCustom: false },
    // Bodyweight
    { id: 'pull_ups', name: 'Pull Ups', equipment: 'bodyweight', primary: 'back', isCustom: false },
    { id: 'chin_ups', name: 'Chin Ups', equipment: 'bodyweight', primary: 'back', isCustom: false },
    { id: 'wide_pull_ups', name: 'Wide Grip Pull Ups', equipment: 'bodyweight', primary: 'back', isCustom: false },
    { id: 'neutral_pull_ups', name: 'Neutral Grip Pull Ups', equipment: 'bodyweight', primary: 'back', isCustom: false },
    { id: 'inverted_row', name: 'Inverted Row', equipment: 'bodyweight', primary: 'back', isCustom: false },
    { id: 'back_extension', name: 'Back Extension', equipment: 'bodyweight', primary: 'back', isCustom: false },
    { id: 'weighted_pull_up', name: 'Weighted Pull Ups', equipment: 'bodyweight', primary: 'back', isCustom: false },
    { id: 'commando_pull_up', name: 'Commando Pull Ups', equipment: 'bodyweight', primary: 'back', isCustom: false },
    { id: 'muscle_up', name: 'Muscle Up', equipment: 'bodyweight', primary: 'back', isCustom: false },
    { id: 'archer_pull_up', name: 'Archer Pull Up', equipment: 'bodyweight', primary: 'back', isCustom: false },
    { id: 'negative_pull_up', name: 'Negative Pull Up', equipment: 'bodyweight', primary: 'back', isCustom: false },
    { id: 'ring_row', name: 'Ring Row', equipment: 'bodyweight', primary: 'back', isCustom: false },
    { id: 'superman', name: 'Superman', equipment: 'bodyweight', primary: 'back', isCustom: false },
    { id: 'bird_dog', name: 'Bird Dog', equipment: 'bodyweight', primary: 'back', isCustom: false },
    // Other
    { id: 'trap_bar_deadlift', name: 'Trap Bar Deadlift', equipment: 'other', primary: 'back', isCustom: false },
    { id: 'landmine_row', name: 'Landmine Row', equipment: 'other', primary: 'back', isCustom: false },
    { id: 'band_pull_apart', name: 'Band Pull Apart', equipment: 'other', primary: 'back', isCustom: false },
    { id: 'kettlebell_row', name: 'Kettlebell Row', equipment: 'other', primary: 'back', isCustom: false },
    { id: 'kettlebell_swing', name: 'Kettlebell Swing', equipment: 'other', primary: 'back', isCustom: false },
  ],
  shoulders: [
    // Barbell
    { id: 'ohp', name: 'Overhead Press (Standing)', equipment: 'barbell', primary: 'shoulders', isCustom: false },
    { id: 'seated_ohp', name: 'Seated Overhead Press', equipment: 'barbell', primary: 'shoulders', isCustom: false },
    { id: 'push_press', name: 'Push Press', equipment: 'barbell', primary: 'shoulders', isCustom: false },
    { id: 'behind_neck_press', name: 'Behind Neck Press', equipment: 'barbell', primary: 'shoulders', isCustom: false },
    { id: 'barbell_upright_row', name: 'Barbell Upright Row', equipment: 'barbell', primary: 'shoulders', isCustom: false },
    { id: 'barbell_front_raise', name: 'Barbell Front Raise', equipment: 'barbell', primary: 'shoulders', isCustom: false },
    { id: 'z_press', name: 'Z Press', equipment: 'barbell', primary: 'shoulders', isCustom: false },
    { id: 'viking_press', name: 'Viking Press', equipment: 'barbell', primary: 'shoulders', isCustom: false },
    { id: 'bradford_press', name: 'Bradford Press', equipment: 'barbell', primary: 'shoulders', isCustom: false },
    { id: 'clean_press', name: 'Clean and Press', equipment: 'barbell', primary: 'shoulders', isCustom: false },
    // Dumbbell
    { id: 'db_shoulder_press', name: 'Dumbbell Shoulder Press', equipment: 'dumbbells', primary: 'shoulders', isCustom: false },
    { id: 'arnold_press', name: 'Arnold Press', equipment: 'dumbbells', primary: 'shoulders', isCustom: false },
    { id: 'seated_db_press', name: 'Seated Dumbbell Press', equipment: 'dumbbells', primary: 'shoulders', isCustom: false },
    { id: 'db_upright_row', name: 'Dumbbell Upright Row', equipment: 'dumbbells', primary: 'shoulders', isCustom: false },
    { id: 'single_arm_ohp', name: 'Single Arm Overhead Press', equipment: 'dumbbells', primary: 'shoulders', isCustom: false },
    { id: 'alternating_db_press_shoulder', name: 'Alternating Dumbbell Press', equipment: 'dumbbells', primary: 'shoulders', isCustom: false },
    { id: 'db_push_press', name: 'Dumbbell Push Press', equipment: 'dumbbells', primary: 'shoulders', isCustom: false },
    { id: 'lateral_raise', name: 'Lateral Raise', equipment: 'dumbbells', primary: 'shoulders', isCustom: false },
    { id: 'front_raise', name: 'Front Raise', equipment: 'dumbbells', primary: 'shoulders', isCustom: false },
    { id: 'rear_delt_fly', name: 'Rear Delt Fly', equipment: 'dumbbells', primary: 'shoulders', isCustom: false },
    { id: 'incline_lateral_raise', name: 'Incline Lateral Raise', equipment: 'dumbbells', primary: 'shoulders', isCustom: false },
    { id: 'bent_over_lateral_raise', name: 'Bent Over Lateral Raise', equipment: 'dumbbells', primary: 'shoulders', isCustom: false },
    { id: 'seated_lateral_raise', name: 'Seated Lateral Raise', equipment: 'dumbbells', primary: 'shoulders', isCustom: false },
    { id: 'leaning_lateral_raise', name: 'Leaning Lateral Raise', equipment: 'dumbbells', primary: 'shoulders', isCustom: false },
    { id: 'lying_rear_delt', name: 'Lying Rear Delt Raise', equipment: 'dumbbells', primary: 'shoulders', isCustom: false },
    { id: 'db_y_raise', name: 'Y Raise', equipment: 'dumbbells', primary: 'shoulders', isCustom: false },
    { id: 'db_w_raise', name: 'W Raise', equipment: 'dumbbells', primary: 'shoulders', isCustom: false },
    { id: 'around_the_world', name: 'Around The World', equipment: 'dumbbells', primary: 'shoulders', isCustom: false },
    { id: 'bus_driver', name: 'Bus Drivers', equipment: 'dumbbells', primary: 'shoulders', isCustom: false },
    { id: 'scaption', name: 'Scaption', equipment: 'dumbbells', primary: 'shoulders', isCustom: false },
    // Machine
    { id: 'machine_shoulder_press', name: 'Machine Shoulder Press', equipment: 'machine', primary: 'shoulders', isCustom: false },
    { id: 'smith_ohp', name: 'Smith Machine Shoulder Press', equipment: 'machine', primary: 'shoulders', isCustom: false },
    { id: 'smith_behind_neck', name: 'Smith Behind Neck Press', equipment: 'machine', primary: 'shoulders', isCustom: false },
    { id: 'lateral_raise_machine', name: 'Lateral Raise Machine', equipment: 'machine', primary: 'shoulders', isCustom: false },
    { id: 'reverse_pec_deck', name: 'Reverse Pec Deck', equipment: 'machine', primary: 'shoulders', isCustom: false },
    { id: 'hammer_shoulder_press', name: 'Hammer Strength Shoulder Press', equipment: 'machine', primary: 'shoulders', isCustom: false },
    { id: 'iso_lateral_shoulder', name: 'Iso-Lateral Shoulder Press', equipment: 'machine', primary: 'shoulders', isCustom: false },
    // Cables
    { id: 'cable_lateral_raise', name: 'Cable Lateral Raise', equipment: 'cables', primary: 'shoulders', isCustom: false },
    { id: 'cable_front_raise', name: 'Cable Front Raise', equipment: 'cables', primary: 'shoulders', isCustom: false },
    { id: 'cable_rear_delt_fly', name: 'Cable Rear Delt Fly', equipment: 'cables', primary: 'shoulders', isCustom: false },
    { id: 'face_pull', name: 'Face Pull', equipment: 'cables', primary: 'shoulders', isCustom: false },
    { id: 'cable_upright_row', name: 'Cable Upright Row', equipment: 'cables', primary: 'shoulders', isCustom: false },
    { id: 'behind_back_cable_raise', name: 'Behind Back Cable Lateral Raise', equipment: 'cables', primary: 'shoulders', isCustom: false },
    { id: 'cable_shoulder_press', name: 'Cable Shoulder Press', equipment: 'cables', primary: 'shoulders', isCustom: false },
    { id: 'high_pull', name: 'High Pull', equipment: 'cables', primary: 'shoulders', isCustom: false },
    { id: 'reverse_cable_crossover', name: 'Reverse Cable Crossover', equipment: 'cables', primary: 'shoulders', isCustom: false },
    // Bodyweight
    { id: 'pike_push_up', name: 'Pike Push Up', equipment: 'bodyweight', primary: 'shoulders', isCustom: false },
    { id: 'handstand_push_up', name: 'Handstand Push Up', equipment: 'bodyweight', primary: 'shoulders', isCustom: false },
    { id: 'wall_handstand_push_up', name: 'Wall Handstand Push Up', equipment: 'bodyweight', primary: 'shoulders', isCustom: false },
    { id: 'decline_pike_push_up', name: 'Decline Pike Push Up', equipment: 'bodyweight', primary: 'shoulders', isCustom: false },
    { id: 'hindu_push_up', name: 'Hindu Push Up', equipment: 'bodyweight', primary: 'shoulders', isCustom: false },
    // Other
    { id: 'kettlebell_press', name: 'Kettlebell Press', equipment: 'other', primary: 'shoulders', isCustom: false },
    { id: 'landmine_shoulder_press', name: 'Landmine Shoulder Press', equipment: 'other', primary: 'shoulders', isCustom: false },
    { id: 'plate_front_raise', name: 'Plate Front Raise', equipment: 'other', primary: 'shoulders', isCustom: false },
    { id: 'band_face_pull', name: 'Band Face Pull', equipment: 'other', primary: 'shoulders', isCustom: false },
    { id: 'band_lateral_raise', name: 'Band Lateral Raise', equipment: 'other', primary: 'shoulders', isCustom: false },
  ],
  biceps: [
    // Barbell
    { id: 'barbell_curl', name: 'Barbell Curl', equipment: 'barbell', primary: 'biceps', isCustom: false },
    { id: 'ez_bar_curl', name: 'EZ Bar Curl', equipment: 'barbell', primary: 'biceps', isCustom: false },
    { id: 'preacher_curl_bb', name: 'Barbell Preacher Curl', equipment: 'barbell', primary: 'biceps', isCustom: false },
    { id: 'drag_curl', name: 'Drag Curl', equipment: 'barbell', primary: 'biceps', isCustom: false },
    { id: 'reverse_curl_bb', name: 'Reverse Barbell Curl', equipment: 'barbell', primary: 'biceps', isCustom: false },
    { id: 'wide_grip_curl', name: 'Wide Grip Barbell Curl', equipment: 'barbell', primary: 'biceps', isCustom: false },
    { id: 'close_grip_curl', name: 'Close Grip Barbell Curl', equipment: 'barbell', primary: 'biceps', isCustom: false },
    { id: 'ez_preacher_curl', name: 'EZ Bar Preacher Curl', equipment: 'barbell', primary: 'biceps', isCustom: false },
    { id: 'cheat_curl', name: 'Cheat Curl', equipment: 'barbell', primary: 'biceps', isCustom: false },
    { id: '21s_curl', name: '21s (Barbell)', equipment: 'barbell', primary: 'biceps', isCustom: false },
    // Dumbbell
    { id: 'db_curl', name: 'Dumbbell Curl', equipment: 'dumbbells', primary: 'biceps', isCustom: false },
    { id: 'hammer_curl', name: 'Hammer Curl', equipment: 'dumbbells', primary: 'biceps', isCustom: false },
    { id: 'incline_curl', name: 'Incline Dumbbell Curl', equipment: 'dumbbells', primary: 'biceps', isCustom: false },
    { id: 'concentration_curl', name: 'Concentration Curl', equipment: 'dumbbells', primary: 'biceps', isCustom: false },
    { id: 'preacher_curl_db', name: 'Dumbbell Preacher Curl', equipment: 'dumbbells', primary: 'biceps', isCustom: false },
    { id: 'cross_body_curl', name: 'Cross Body Hammer Curl', equipment: 'dumbbells', primary: 'biceps', isCustom: false },
    { id: 'zottman_curl', name: 'Zottman Curl', equipment: 'dumbbells', primary: 'biceps', isCustom: false },
    { id: 'spider_curl', name: 'Spider Curl', equipment: 'dumbbells', primary: 'biceps', isCustom: false },
    { id: 'alternating_curl', name: 'Alternating Dumbbell Curl', equipment: 'dumbbells', primary: 'biceps', isCustom: false },
    { id: 'seated_curl', name: 'Seated Dumbbell Curl', equipment: 'dumbbells', primary: 'biceps', isCustom: false },
    { id: 'scott_curl', name: 'Scott Curl', equipment: 'dumbbells', primary: 'biceps', isCustom: false },
    { id: 'decline_curl', name: 'Decline Dumbbell Curl', equipment: 'dumbbells', primary: 'biceps', isCustom: false },
    { id: 'waiter_curl', name: 'Waiter Curl', equipment: 'dumbbells', primary: 'biceps', isCustom: false },
    { id: 'prone_incline_curl', name: 'Prone Incline Curl', equipment: 'dumbbells', primary: 'biceps', isCustom: false },
    { id: 'supinating_curl', name: 'Supinating Dumbbell Curl', equipment: 'dumbbells', primary: 'biceps', isCustom: false },
    // Machine
    { id: 'preacher_curl', name: 'Machine Preacher Curl', equipment: 'machine', primary: 'biceps', isCustom: false },
    { id: 'machine_curl', name: 'Machine Bicep Curl', equipment: 'machine', primary: 'biceps', isCustom: false },
    // Cables
    { id: 'cable_curl', name: 'Cable Curl', equipment: 'cables', primary: 'biceps', isCustom: false },
    { id: 'cable_hammer_curl', name: 'Cable Hammer Curl (Rope)', equipment: 'cables', primary: 'biceps', isCustom: false },
    { id: 'high_cable_curl', name: 'High Cable Curl', equipment: 'cables', primary: 'biceps', isCustom: false },
    { id: 'overhead_cable_curl', name: 'Overhead Cable Curl', equipment: 'cables', primary: 'biceps', isCustom: false },
    { id: 'bayesian_curl', name: 'Bayesian Cable Curl', equipment: 'cables', primary: 'biceps', isCustom: false },
    { id: 'single_cable_curl', name: 'Single Arm Cable Curl', equipment: 'cables', primary: 'biceps', isCustom: false },
    { id: 'lying_cable_curl', name: 'Lying Cable Curl', equipment: 'cables', primary: 'biceps', isCustom: false },
    { id: 'cable_preacher_curl', name: 'Cable Preacher Curl', equipment: 'cables', primary: 'biceps', isCustom: false },
    { id: 'cable_concentration_curl', name: 'Cable Concentration Curl', equipment: 'cables', primary: 'biceps', isCustom: false },
    // Other
    { id: 'band_curl', name: 'Resistance Band Curl', equipment: 'other', primary: 'biceps', isCustom: false },
    { id: 'kettlebell_curl', name: 'Kettlebell Curl', equipment: 'other', primary: 'biceps', isCustom: false },
    { id: 'trx_curl', name: 'TRX Bicep Curl', equipment: 'other', primary: 'biceps', isCustom: false },
  ],
  triceps: [
    // Barbell
    { id: 'close_grip_bench_tri', name: 'Close Grip Bench Press', equipment: 'barbell', primary: 'triceps', isCustom: false },
    { id: 'skull_crusher', name: 'Skull Crusher', equipment: 'barbell', primary: 'triceps', isCustom: false },
    { id: 'ez_bar_skull_crusher', name: 'EZ Bar Skull Crusher', equipment: 'barbell', primary: 'triceps', isCustom: false },
    { id: 'jm_press', name: 'JM Press', equipment: 'barbell', primary: 'triceps', isCustom: false },
    { id: 'french_press', name: 'French Press (Standing)', equipment: 'barbell', primary: 'triceps', isCustom: false },
    { id: 'california_press', name: 'California Press', equipment: 'barbell', primary: 'triceps', isCustom: false },
    { id: 'incline_skull_crusher', name: 'Incline Skull Crusher', equipment: 'barbell', primary: 'triceps', isCustom: false },
    { id: 'decline_skull_crusher', name: 'Decline Skull Crusher', equipment: 'barbell', primary: 'triceps', isCustom: false },
    // Dumbbell
    { id: 'db_tricep_extension', name: 'Dumbbell Tricep Extension', equipment: 'dumbbells', primary: 'triceps', isCustom: false },
    { id: 'db_kickback', name: 'Dumbbell Kickback', equipment: 'dumbbells', primary: 'triceps', isCustom: false },
    { id: 'overhead_db_extension', name: 'Overhead Dumbbell Extension', equipment: 'dumbbells', primary: 'triceps', isCustom: false },
    { id: 'two_arm_overhead_ext', name: 'Two Arm Overhead Extension', equipment: 'dumbbells', primary: 'triceps', isCustom: false },
    { id: 'tate_press', name: 'Tate Press', equipment: 'dumbbells', primary: 'triceps', isCustom: false },
    { id: 'db_skull_crusher', name: 'Dumbbell Skull Crusher', equipment: 'dumbbells', primary: 'triceps', isCustom: false },
    { id: 'lying_db_extension', name: 'Lying Dumbbell Extension', equipment: 'dumbbells', primary: 'triceps', isCustom: false },
    { id: 'incline_db_extension', name: 'Incline Dumbbell Extension', equipment: 'dumbbells', primary: 'triceps', isCustom: false },
    { id: 'jm_press_db', name: 'Dumbbell JM Press', equipment: 'dumbbells', primary: 'triceps', isCustom: false },
    // Machine
    { id: 'tricep_dip_machine', name: 'Tricep Dip Machine', equipment: 'machine', primary: 'triceps', isCustom: false },
    { id: 'tricep_extension_machine', name: 'Tricep Extension Machine', equipment: 'machine', primary: 'triceps', isCustom: false },
    { id: 'assisted_dip_machine', name: 'Assisted Dip Machine', equipment: 'machine', primary: 'triceps', isCustom: false },
    // Cables
    { id: 'tricep_pushdown', name: 'Tricep Pushdown (V-Bar)', equipment: 'cables', primary: 'triceps', isCustom: false },
    { id: 'rope_pushdown', name: 'Rope Tricep Pushdown', equipment: 'cables', primary: 'triceps', isCustom: false },
    { id: 'straight_bar_pushdown', name: 'Straight Bar Pushdown', equipment: 'cables', primary: 'triceps', isCustom: false },
    { id: 'overhead_extension', name: 'Overhead Cable Extension', equipment: 'cables', primary: 'triceps', isCustom: false },
    { id: 'reverse_grip_pushdown', name: 'Reverse Grip Pushdown', equipment: 'cables', primary: 'triceps', isCustom: false },
    { id: 'single_arm_pushdown', name: 'Single Arm Cable Pushdown', equipment: 'cables', primary: 'triceps', isCustom: false },
    { id: 'cable_kickback', name: 'Cable Kickback', equipment: 'cables', primary: 'triceps', isCustom: false },
    { id: 'overhead_rope_extension', name: 'Overhead Rope Extension', equipment: 'cables', primary: 'triceps', isCustom: false },
    { id: 'incline_cable_extension', name: 'Incline Cable Extension', equipment: 'cables', primary: 'triceps', isCustom: false },
    { id: 'lying_cable_extension', name: 'Lying Cable Extension', equipment: 'cables', primary: 'triceps', isCustom: false },
    // Bodyweight
    { id: 'tricep_dips', name: 'Tricep Dips', equipment: 'bodyweight', primary: 'triceps', isCustom: false },
    { id: 'bench_dips', name: 'Bench Dips', equipment: 'bodyweight', primary: 'triceps', isCustom: false },
    { id: 'diamond_push_ups_tri', name: 'Diamond Push Ups', equipment: 'bodyweight', primary: 'triceps', isCustom: false },
    { id: 'close_push_ups', name: 'Close Grip Push Ups', equipment: 'bodyweight', primary: 'triceps', isCustom: false },
    { id: 'weighted_dips', name: 'Weighted Dips', equipment: 'bodyweight', primary: 'triceps', isCustom: false },
    { id: 'ring_dips', name: 'Ring Dips', equipment: 'bodyweight', primary: 'triceps', isCustom: false },
    { id: 'bodyweight_skull_crusher', name: 'Bodyweight Skull Crusher', equipment: 'bodyweight', primary: 'triceps', isCustom: false },
    // Other
    { id: 'band_pushdown', name: 'Band Tricep Pushdown', equipment: 'other', primary: 'triceps', isCustom: false },
    { id: 'band_overhead_ext', name: 'Band Overhead Extension', equipment: 'other', primary: 'triceps', isCustom: false },
    { id: 'kettlebell_extension', name: 'Kettlebell Tricep Extension', equipment: 'other', primary: 'triceps', isCustom: false },
  ],
  quads: [
    // Barbell
    { id: 'squat', name: 'Barbell Back Squat', equipment: 'barbell', primary: 'quads', isCustom: false },
    { id: 'front_squat', name: 'Front Squat', equipment: 'barbell', primary: 'quads', isCustom: false },
    { id: 'zercher_squat', name: 'Zercher Squat', equipment: 'barbell', primary: 'quads', isCustom: false },
    { id: 'pause_squat', name: 'Pause Squat', equipment: 'barbell', primary: 'quads', isCustom: false },
    { id: 'box_squat', name: 'Box Squat', equipment: 'barbell', primary: 'quads', isCustom: false },
    { id: 'barbell_lunge', name: 'Barbell Lunge', equipment: 'barbell', primary: 'quads', isCustom: false },
    { id: 'high_bar_squat', name: 'High Bar Squat', equipment: 'barbell', primary: 'quads', isCustom: false },
    { id: 'low_bar_squat', name: 'Low Bar Squat', equipment: 'barbell', primary: 'quads', isCustom: false },
    { id: 'anderson_squat', name: 'Anderson Squat', equipment: 'barbell', primary: 'quads', isCustom: false },
    { id: 'tempo_squat', name: 'Tempo Squat', equipment: 'barbell', primary: 'quads', isCustom: false },
    { id: 'pin_squat', name: 'Pin Squat', equipment: 'barbell', primary: 'quads', isCustom: false },
    { id: 'safety_bar_squat', name: 'Safety Bar Squat', equipment: 'barbell', primary: 'quads', isCustom: false },
    // Dumbbell
    { id: 'goblet_squat', name: 'Goblet Squat', equipment: 'dumbbells', primary: 'quads', isCustom: false },
    { id: 'db_lunges', name: 'Dumbbell Lunges', equipment: 'dumbbells', primary: 'quads', isCustom: false },
    { id: 'walking_lunges', name: 'Walking Lunges', equipment: 'dumbbells', primary: 'quads', isCustom: false },
    { id: 'reverse_lunge', name: 'Reverse Lunge', equipment: 'dumbbells', primary: 'quads', isCustom: false },
    { id: 'bulgarian_split_squat', name: 'Bulgarian Split Squat', equipment: 'dumbbells', primary: 'quads', isCustom: false },
    { id: 'db_step_up', name: 'Dumbbell Step Up', equipment: 'dumbbells', primary: 'quads', isCustom: false },
    { id: 'db_squat', name: 'Dumbbell Squat', equipment: 'dumbbells', primary: 'quads', isCustom: false },
    { id: 'split_squat', name: 'Split Squat', equipment: 'dumbbells', primary: 'quads', isCustom: false },
    { id: 'lateral_lunge', name: 'Lateral Lunge', equipment: 'dumbbells', primary: 'quads', isCustom: false },
    { id: 'curtsy_lunge', name: 'Curtsy Lunge', equipment: 'dumbbells', primary: 'quads', isCustom: false },
    { id: 'heel_elevated_squat', name: 'Heel Elevated Goblet Squat', equipment: 'dumbbells', primary: 'quads', isCustom: false },
    // Machine
    { id: 'leg_press', name: 'Leg Press', equipment: 'machine', primary: 'quads', isCustom: false },
    { id: 'leg_extension', name: 'Leg Extension', equipment: 'machine', primary: 'quads', isCustom: false },
    { id: 'hack_squat', name: 'Hack Squat', equipment: 'machine', primary: 'quads', isCustom: false },
    { id: 'v_squat', name: 'V-Squat Machine', equipment: 'machine', primary: 'quads', isCustom: false },
    { id: 'smith_squat', name: 'Smith Machine Squat', equipment: 'machine', primary: 'quads', isCustom: false },
    { id: 'pendulum_squat', name: 'Pendulum Squat', equipment: 'machine', primary: 'quads', isCustom: false },
    { id: 'belt_squat', name: 'Belt Squat', equipment: 'machine', primary: 'quads', isCustom: false },
    { id: 'sissy_squat_machine', name: 'Sissy Squat Machine', equipment: 'machine', primary: 'quads', isCustom: false },
    { id: 'smith_lunge', name: 'Smith Machine Lunge', equipment: 'machine', primary: 'quads', isCustom: false },
    { id: 'smith_split_squat', name: 'Smith Machine Split Squat', equipment: 'machine', primary: 'quads', isCustom: false },
    { id: 'single_leg_press', name: 'Single Leg Press', equipment: 'machine', primary: 'quads', isCustom: false },
    { id: 'close_stance_leg_press', name: 'Close Stance Leg Press', equipment: 'machine', primary: 'quads', isCustom: false },
    { id: 'narrow_hack_squat', name: 'Narrow Stance Hack Squat', equipment: 'machine', primary: 'quads', isCustom: false },
    // Bodyweight
    { id: 'bodyweight_squat', name: 'Bodyweight Squat', equipment: 'bodyweight', primary: 'quads', isCustom: false },
    { id: 'pistol_squat', name: 'Pistol Squat', equipment: 'bodyweight', primary: 'quads', isCustom: false },
    { id: 'jump_squat', name: 'Jump Squat', equipment: 'bodyweight', primary: 'quads', isCustom: false },
    { id: 'wall_sit', name: 'Wall Sit', equipment: 'bodyweight', primary: 'quads', isCustom: false },
    { id: 'sissy_squat', name: 'Sissy Squat', equipment: 'bodyweight', primary: 'quads', isCustom: false },
    { id: 'bw_lunge', name: 'Bodyweight Lunge', equipment: 'bodyweight', primary: 'quads', isCustom: false },
    { id: 'jump_lunge', name: 'Jump Lunge', equipment: 'bodyweight', primary: 'quads', isCustom: false },
    { id: 'shrimp_squat', name: 'Shrimp Squat', equipment: 'bodyweight', primary: 'quads', isCustom: false },
    { id: 'hindu_squat', name: 'Hindu Squat', equipment: 'bodyweight', primary: 'quads', isCustom: false },
    { id: 'skater_squat', name: 'Skater Squat', equipment: 'bodyweight', primary: 'quads', isCustom: false },
    // Other
    { id: 'landmine_squat', name: 'Landmine Squat', equipment: 'other', primary: 'quads', isCustom: false },
    { id: 'kettlebell_squat', name: 'Kettlebell Squat', equipment: 'other', primary: 'quads', isCustom: false },
    { id: 'sled_push', name: 'Sled Push', equipment: 'other', primary: 'quads', isCustom: false },
    { id: 'band_squat', name: 'Banded Squat', equipment: 'other', primary: 'quads', isCustom: false },
  ],
  hamstrings: [
    // Barbell
    { id: 'rdl', name: 'Romanian Deadlift', equipment: 'barbell', primary: 'hamstrings', isCustom: false },
    { id: 'stiff_leg_deadlift', name: 'Stiff Leg Deadlift', equipment: 'barbell', primary: 'hamstrings', isCustom: false },
    { id: 'good_morning', name: 'Good Morning', equipment: 'barbell', primary: 'hamstrings', isCustom: false },
    { id: 'sumo_rdl', name: 'Sumo Romanian Deadlift', equipment: 'barbell', primary: 'hamstrings', isCustom: false },
    { id: 'deficit_rdl', name: 'Deficit Romanian Deadlift', equipment: 'barbell', primary: 'hamstrings', isCustom: false },
    { id: 'snatch_grip_rdl', name: 'Snatch Grip Romanian Deadlift', equipment: 'barbell', primary: 'hamstrings', isCustom: false },
    // Dumbbell
    { id: 'db_rdl', name: 'Dumbbell Romanian Deadlift', equipment: 'dumbbells', primary: 'hamstrings', isCustom: false },
    { id: 'single_leg_rdl', name: 'Single Leg Romanian Deadlift', equipment: 'dumbbells', primary: 'hamstrings', isCustom: false },
    { id: 'db_stiff_leg_dl', name: 'Dumbbell Stiff Leg Deadlift', equipment: 'dumbbells', primary: 'hamstrings', isCustom: false },
    { id: 'kickstand_rdl', name: 'Kickstand Romanian Deadlift', equipment: 'dumbbells', primary: 'hamstrings', isCustom: false },
    { id: 'db_good_morning', name: 'Dumbbell Good Morning', equipment: 'dumbbells', primary: 'hamstrings', isCustom: false },
    // Machine
    { id: 'leg_curl', name: 'Lying Leg Curl', equipment: 'machine', primary: 'hamstrings', isCustom: false },
    { id: 'seated_leg_curl', name: 'Seated Leg Curl', equipment: 'machine', primary: 'hamstrings', isCustom: false },
    { id: 'standing_leg_curl', name: 'Standing Leg Curl', equipment: 'machine', primary: 'hamstrings', isCustom: false },
    { id: 'smith_rdl', name: 'Smith Machine Romanian Deadlift', equipment: 'machine', primary: 'hamstrings', isCustom: false },
    { id: 'smith_good_morning', name: 'Smith Machine Good Morning', equipment: 'machine', primary: 'hamstrings', isCustom: false },
    // Cables
    { id: 'cable_pull_through', name: 'Cable Pull Through', equipment: 'cables', primary: 'hamstrings', isCustom: false },
    { id: 'cable_leg_curl', name: 'Cable Leg Curl', equipment: 'cables', primary: 'hamstrings', isCustom: false },
    { id: 'cable_kickback_ham', name: 'Cable Kickback', equipment: 'cables', primary: 'hamstrings', isCustom: false },
    // Bodyweight
    { id: 'nordic_curl', name: 'Nordic Curl', equipment: 'bodyweight', primary: 'hamstrings', isCustom: false },
    { id: 'glute_ham_raise', name: 'Glute Ham Raise', equipment: 'bodyweight', primary: 'hamstrings', isCustom: false },
    { id: 'sliding_leg_curl', name: 'Sliding Leg Curl', equipment: 'bodyweight', primary: 'hamstrings', isCustom: false },
    { id: 'single_leg_bridge', name: 'Single Leg Glute Bridge', equipment: 'bodyweight', primary: 'hamstrings', isCustom: false },
    { id: 'reverse_hyper', name: 'Reverse Hyperextension', equipment: 'bodyweight', primary: 'hamstrings', isCustom: false },
    { id: 'prone_leg_curl_bw', name: 'Prone Leg Curl (BW)', equipment: 'bodyweight', primary: 'hamstrings', isCustom: false },
    // Other
    { id: 'kettlebell_rdl', name: 'Kettlebell Romanian Deadlift', equipment: 'other', primary: 'hamstrings', isCustom: false },
    { id: 'kettlebell_swing_ham', name: 'Kettlebell Swing', equipment: 'other', primary: 'hamstrings', isCustom: false },
    { id: 'band_leg_curl', name: 'Band Leg Curl', equipment: 'other', primary: 'hamstrings', isCustom: false },
    { id: 'swiss_ball_curl', name: 'Swiss Ball Leg Curl', equipment: 'other', primary: 'hamstrings', isCustom: false },
  ],
  glutes: [
    // Barbell
    { id: 'hip_thrust', name: 'Barbell Hip Thrust', equipment: 'barbell', primary: 'glutes', isCustom: false },
    { id: 'sumo_deadlift', name: 'Sumo Deadlift', equipment: 'barbell', primary: 'glutes', isCustom: false },
    { id: 'barbell_glute_bridge', name: 'Barbell Glute Bridge', equipment: 'barbell', primary: 'glutes', isCustom: false },
    { id: 'wide_stance_squat', name: 'Wide Stance Squat', equipment: 'barbell', primary: 'glutes', isCustom: false },
    { id: 'single_leg_hip_thrust_bb', name: 'Single Leg Barbell Hip Thrust', equipment: 'barbell', primary: 'glutes', isCustom: false },
    // Dumbbell
    { id: 'db_hip_thrust', name: 'Dumbbell Hip Thrust', equipment: 'dumbbells', primary: 'glutes', isCustom: false },
    { id: 'db_glute_bridge', name: 'Dumbbell Glute Bridge', equipment: 'dumbbells', primary: 'glutes', isCustom: false },
    { id: 'db_sumo_squat', name: 'Dumbbell Sumo Squat', equipment: 'dumbbells', primary: 'glutes', isCustom: false },
    { id: 'step_up', name: 'Step Up', equipment: 'dumbbells', primary: 'glutes', isCustom: false },
    { id: 'elevated_split_squat', name: 'Elevated Split Squat', equipment: 'dumbbells', primary: 'glutes', isCustom: false },
    { id: 'deficit_reverse_lunge', name: 'Deficit Reverse Lunge', equipment: 'dumbbells', primary: 'glutes', isCustom: false },
    // Machine
    { id: 'hip_thrust_machine', name: 'Hip Thrust Machine', equipment: 'machine', primary: 'glutes', isCustom: false },
    { id: 'glute_kickback_machine', name: 'Glute Kickback Machine', equipment: 'machine', primary: 'glutes', isCustom: false },
    { id: 'hip_abduction', name: 'Hip Abduction Machine', equipment: 'machine', primary: 'glutes', isCustom: false },
    { id: 'reverse_hack_squat', name: 'Reverse Hack Squat', equipment: 'machine', primary: 'glutes', isCustom: false },
    { id: 'smith_hip_thrust', name: 'Smith Machine Hip Thrust', equipment: 'machine', primary: 'glutes', isCustom: false },
    { id: 'wide_leg_press', name: 'Wide Stance Leg Press', equipment: 'machine', primary: 'glutes', isCustom: false },
    { id: 'smith_squat_glute', name: 'Smith Machine Squat (Feet Forward)', equipment: 'machine', primary: 'glutes', isCustom: false },
    // Cables
    { id: 'cable_glute_kickback', name: 'Cable Kickback', equipment: 'cables', primary: 'glutes', isCustom: false },
    { id: 'cable_pull_through_glute', name: 'Cable Pull Through', equipment: 'cables', primary: 'glutes', isCustom: false },
    { id: 'cable_hip_abduction', name: 'Cable Hip Abduction', equipment: 'cables', primary: 'glutes', isCustom: false },
    { id: 'cable_hip_extension', name: 'Cable Hip Extension', equipment: 'cables', primary: 'glutes', isCustom: false },
    { id: 'standing_cable_hip_thrust', name: 'Standing Cable Hip Thrust', equipment: 'cables', primary: 'glutes', isCustom: false },
    // Bodyweight
    { id: 'glute_bridge', name: 'Glute Bridge', equipment: 'bodyweight', primary: 'glutes', isCustom: false },
    { id: 'donkey_kick', name: 'Donkey Kick', equipment: 'bodyweight', primary: 'glutes', isCustom: false },
    { id: 'fire_hydrant', name: 'Fire Hydrant', equipment: 'bodyweight', primary: 'glutes', isCustom: false },
    { id: 'frog_pump', name: 'Frog Pump', equipment: 'bodyweight', primary: 'glutes', isCustom: false },
    { id: 'clamshell', name: 'Clamshell', equipment: 'bodyweight', primary: 'glutes', isCustom: false },
    { id: 'single_leg_glute_bridge', name: 'Single Leg Glute Bridge', equipment: 'bodyweight', primary: 'glutes', isCustom: false },
    { id: 'quadruped_hip_ext', name: 'Quadruped Hip Extension', equipment: 'bodyweight', primary: 'glutes', isCustom: false },
    { id: 'bw_hip_thrust', name: 'Bodyweight Hip Thrust', equipment: 'bodyweight', primary: 'glutes', isCustom: false },
    // Bands
    { id: 'banded_walk', name: 'Banded Lateral Walk', equipment: 'other', primary: 'glutes', isCustom: false },
    { id: 'banded_squat', name: 'Banded Squat', equipment: 'other', primary: 'glutes', isCustom: false },
    { id: 'banded_hip_thrust', name: 'Banded Hip Thrust', equipment: 'other', primary: 'glutes', isCustom: false },
    { id: 'banded_clamshell', name: 'Banded Clamshell', equipment: 'other', primary: 'glutes', isCustom: false },
    { id: 'banded_kickback', name: 'Banded Kickback', equipment: 'other', primary: 'glutes', isCustom: false },
    { id: 'kettlebell_swing_glute', name: 'Kettlebell Swing', equipment: 'other', primary: 'glutes', isCustom: false },
  ],
  calves: [
    // Machine
    { id: 'standing_calf_raise', name: 'Standing Calf Raise', equipment: 'machine', primary: 'calves', isCustom: false },
    { id: 'seated_calf_raise', name: 'Seated Calf Raise', equipment: 'machine', primary: 'calves', isCustom: false },
    { id: 'leg_press_calf', name: 'Leg Press Calf Raise', equipment: 'machine', primary: 'calves', isCustom: false },
    { id: 'donkey_calf_raise', name: 'Donkey Calf Raise', equipment: 'machine', primary: 'calves', isCustom: false },
    { id: 'hack_squat_calf', name: 'Hack Squat Calf Raise', equipment: 'machine', primary: 'calves', isCustom: false },
    { id: 'calf_press_machine', name: 'Calf Press Machine', equipment: 'machine', primary: 'calves', isCustom: false },
    // Dumbbell
    { id: 'db_calf_raise', name: 'Dumbbell Calf Raise', equipment: 'dumbbells', primary: 'calves', isCustom: false },
    { id: 'single_leg_db_calf', name: 'Single Leg Dumbbell Calf Raise', equipment: 'dumbbells', primary: 'calves', isCustom: false },
    { id: 'seated_db_calf_raise', name: 'Seated Dumbbell Calf Raise', equipment: 'dumbbells', primary: 'calves', isCustom: false },
    // Barbell
    { id: 'bb_calf_raise', name: 'Barbell Calf Raise', equipment: 'barbell', primary: 'calves', isCustom: false },
    { id: 'smith_calf_raise', name: 'Smith Machine Calf Raise', equipment: 'barbell', primary: 'calves', isCustom: false },
    // Bodyweight
    { id: 'bodyweight_calf_raise', name: 'Bodyweight Calf Raise', equipment: 'bodyweight', primary: 'calves', isCustom: false },
    { id: 'single_leg_calf_raise', name: 'Single Leg Calf Raise', equipment: 'bodyweight', primary: 'calves', isCustom: false },
    { id: 'stair_calf_raise', name: 'Stair Calf Raise', equipment: 'bodyweight', primary: 'calves', isCustom: false },
    { id: 'tibialis_raise', name: 'Tibialis Raise', equipment: 'bodyweight', primary: 'calves', isCustom: false },
    { id: 'calf_jump', name: 'Calf Jumps', equipment: 'bodyweight', primary: 'calves', isCustom: false },
    // Other
    { id: 'belt_squat_calf', name: 'Belt Squat Calf Raise', equipment: 'other', primary: 'calves', isCustom: false },
  ],
  abs: [
    // Cables
    { id: 'cable_crunch', name: 'Cable Crunch', equipment: 'cables', primary: 'abs', isCustom: false },
    { id: 'cable_woodchop', name: 'Cable Woodchop', equipment: 'cables', primary: 'abs', isCustom: false },
    { id: 'pallof_press', name: 'Pallof Press', equipment: 'cables', primary: 'abs', isCustom: false },
    { id: 'high_woodchop', name: 'High to Low Woodchop', equipment: 'cables', primary: 'abs', isCustom: false },
    { id: 'low_woodchop', name: 'Low to High Woodchop', equipment: 'cables', primary: 'abs', isCustom: false },
    { id: 'cable_twist', name: 'Cable Twist', equipment: 'cables', primary: 'abs', isCustom: false },
    // Machine
    { id: 'ab_machine', name: 'Ab Crunch Machine', equipment: 'machine', primary: 'abs', isCustom: false },
    { id: 'torso_rotation', name: 'Torso Rotation Machine', equipment: 'machine', primary: 'abs', isCustom: false },
    { id: 'decline_sit_up', name: 'Decline Sit Up', equipment: 'machine', primary: 'abs', isCustom: false },
    // Bodyweight
    { id: 'hanging_leg_raise', name: 'Hanging Leg Raise', equipment: 'bodyweight', primary: 'abs', isCustom: false },
    { id: 'hanging_knee_raise', name: 'Hanging Knee Raise', equipment: 'bodyweight', primary: 'abs', isCustom: false },
    { id: 'captain_chair_leg_raise', name: 'Captain Chair Leg Raise', equipment: 'bodyweight', primary: 'abs', isCustom: false },
    { id: 'crunch', name: 'Crunch', equipment: 'bodyweight', primary: 'abs', isCustom: false },
    { id: 'reverse_crunch', name: 'Reverse Crunch', equipment: 'bodyweight', primary: 'abs', isCustom: false },
    { id: 'bicycle_crunch', name: 'Bicycle Crunch', equipment: 'bodyweight', primary: 'abs', isCustom: false },
    { id: 'plank', name: 'Plank', equipment: 'bodyweight', primary: 'abs', isCustom: false },
    { id: 'side_plank', name: 'Side Plank', equipment: 'bodyweight', primary: 'abs', isCustom: false },
    { id: 'dead_bug', name: 'Dead Bug', equipment: 'bodyweight', primary: 'abs', isCustom: false },
    { id: 'mountain_climber', name: 'Mountain Climber', equipment: 'bodyweight', primary: 'abs', isCustom: false },
    { id: 'russian_twist', name: 'Russian Twist', equipment: 'bodyweight', primary: 'abs', isCustom: false },
    { id: 'v_up', name: 'V-Up', equipment: 'bodyweight', primary: 'abs', isCustom: false },
    { id: 'toe_touch', name: 'Toe Touch', equipment: 'bodyweight', primary: 'abs', isCustom: false },
    { id: 'flutter_kick', name: 'Flutter Kicks', equipment: 'bodyweight', primary: 'abs', isCustom: false },
    { id: 'leg_raise', name: 'Lying Leg Raise', equipment: 'bodyweight', primary: 'abs', isCustom: false },
    { id: 'hollow_hold', name: 'Hollow Body Hold', equipment: 'bodyweight', primary: 'abs', isCustom: false },
    { id: 'l_sit', name: 'L-Sit', equipment: 'bodyweight', primary: 'abs', isCustom: false },
    { id: 'toes_to_bar', name: 'Toes to Bar', equipment: 'bodyweight', primary: 'abs', isCustom: false },
    { id: 'wipers', name: 'Windshield Wipers', equipment: 'bodyweight', primary: 'abs', isCustom: false },
    { id: 'sit_up', name: 'Sit Up', equipment: 'bodyweight', primary: 'abs', isCustom: false },
    { id: 'plank_shoulder_tap', name: 'Plank Shoulder Tap', equipment: 'bodyweight', primary: 'abs', isCustom: false },
    { id: 'bear_crawl', name: 'Bear Crawl', equipment: 'bodyweight', primary: 'abs', isCustom: false },
    { id: 'dragon_flag', name: 'Dragon Flag', equipment: 'bodyweight', primary: 'abs', isCustom: false },
    { id: 'human_flag', name: 'Human Flag', equipment: 'bodyweight', primary: 'abs', isCustom: false },
    // Other
    { id: 'ab_wheel', name: 'Ab Wheel Rollout', equipment: 'other', primary: 'abs', isCustom: false },
    { id: 'decline_crunch', name: 'Decline Crunch', equipment: 'other', primary: 'abs', isCustom: false },
    { id: 'weighted_crunch', name: 'Weighted Crunch', equipment: 'other', primary: 'abs', isCustom: false },
    { id: 'medicine_ball_slam', name: 'Medicine Ball Slam', equipment: 'other', primary: 'abs', isCustom: false },
    { id: 'medicine_ball_twist', name: 'Medicine Ball Twist', equipment: 'other', primary: 'abs', isCustom: false },
    { id: 'weighted_plank', name: 'Weighted Plank', equipment: 'other', primary: 'abs', isCustom: false },
    { id: 'swiss_ball_crunch', name: 'Swiss Ball Crunch', equipment: 'other', primary: 'abs', isCustom: false },
    { id: 'swiss_ball_pike', name: 'Swiss Ball Pike', equipment: 'other', primary: 'abs', isCustom: false },
  ],
  traps: [
    // Barbell
    { id: 'barbell_shrug', name: 'Barbell Shrug', equipment: 'barbell', primary: 'traps', isCustom: false },
    { id: 'behind_back_shrug', name: 'Behind Back Barbell Shrug', equipment: 'barbell', primary: 'traps', isCustom: false },
    { id: 'power_shrug', name: 'Power Shrug', equipment: 'barbell', primary: 'traps', isCustom: false },
    { id: 'snatch_grip_shrug', name: 'Snatch Grip Shrug', equipment: 'barbell', primary: 'traps', isCustom: false },
    { id: 'barbell_upright_row_trap', name: 'Barbell Upright Row', equipment: 'barbell', primary: 'traps', isCustom: false },
    { id: 'hang_clean', name: 'Hang Clean', equipment: 'barbell', primary: 'traps', isCustom: false },
    { id: 'hang_snatch', name: 'Hang Snatch', equipment: 'barbell', primary: 'traps', isCustom: false },
    { id: 'power_clean', name: 'Power Clean', equipment: 'barbell', primary: 'traps', isCustom: false },
    { id: 'high_pull_bb', name: 'Barbell High Pull', equipment: 'barbell', primary: 'traps', isCustom: false },
    // Dumbbell
    { id: 'db_shrug', name: 'Dumbbell Shrug', equipment: 'dumbbells', primary: 'traps', isCustom: false },
    { id: 'incline_db_shrug', name: 'Incline Dumbbell Shrug', equipment: 'dumbbells', primary: 'traps', isCustom: false },
    { id: 'seated_db_shrug', name: 'Seated Dumbbell Shrug', equipment: 'dumbbells', primary: 'traps', isCustom: false },
    { id: 'db_upright_row_trap', name: 'Dumbbell Upright Row', equipment: 'dumbbells', primary: 'traps', isCustom: false },
    { id: 'prone_y_raise', name: 'Prone Y Raise', equipment: 'dumbbells', primary: 'traps', isCustom: false },
    { id: 'db_high_pull', name: 'Dumbbell High Pull', equipment: 'dumbbells', primary: 'traps', isCustom: false },
    { id: 'shrug_row', name: 'Dumbbell Shrug Row', equipment: 'dumbbells', primary: 'traps', isCustom: false },
    // Machine
    { id: 'machine_shrug', name: 'Machine Shrug', equipment: 'machine', primary: 'traps', isCustom: false },
    { id: 'smith_shrug', name: 'Smith Machine Shrug', equipment: 'machine', primary: 'traps', isCustom: false },
    { id: 'trap_bar_shrug', name: 'Trap Bar Shrug', equipment: 'machine', primary: 'traps', isCustom: false },
    // Cables
    { id: 'cable_shrug', name: 'Cable Shrug', equipment: 'cables', primary: 'traps', isCustom: false },
    { id: 'cable_upright_row_trap', name: 'Cable Upright Row', equipment: 'cables', primary: 'traps', isCustom: false },
    { id: 'face_pull_trap', name: 'Face Pull (Trap Focus)', equipment: 'cables', primary: 'traps', isCustom: false },
    { id: 'cable_y_raise', name: 'Cable Y Raise', equipment: 'cables', primary: 'traps', isCustom: false },
    // Other
    { id: 'farmers_walk', name: 'Farmers Walk', equipment: 'other', primary: 'traps', isCustom: false },
    { id: 'farmers_carry', name: 'Farmers Carry', equipment: 'other', primary: 'traps', isCustom: false },
    { id: 'kettlebell_shrug', name: 'Kettlebell Shrug', equipment: 'other', primary: 'traps', isCustom: false },
    { id: 'kettlebell_carry', name: 'Kettlebell Carry', equipment: 'other', primary: 'traps', isCustom: false },
    { id: 'trap_bar_carry', name: 'Trap Bar Carry', equipment: 'other', primary: 'traps', isCustom: false },
    { id: 'suitcase_carry', name: 'Suitcase Carry', equipment: 'other', primary: 'traps', isCustom: false },
    { id: 'overhead_carry', name: 'Overhead Carry', equipment: 'other', primary: 'traps', isCustom: false },
    { id: 'band_pull_apart_trap', name: 'Band Pull Apart', equipment: 'other', primary: 'traps', isCustom: false },
    { id: 'band_face_pull_trap', name: 'Band Face Pull', equipment: 'other', primary: 'traps', isCustom: false },
  ],
  forearms: [
    // Barbell
    { id: 'wrist_curl_bb', name: 'Barbell Wrist Curl', equipment: 'barbell', primary: 'forearms', isCustom: false },
    { id: 'reverse_wrist_curl_bb', name: 'Reverse Barbell Wrist Curl', equipment: 'barbell', primary: 'forearms', isCustom: false },
    { id: 'behind_back_wrist_curl', name: 'Behind Back Wrist Curl', equipment: 'barbell', primary: 'forearms', isCustom: false },
    { id: 'reverse_curl', name: 'Reverse Curl', equipment: 'barbell', primary: 'forearms', isCustom: false },
    { id: 'wrist_roller', name: 'Wrist Roller', equipment: 'barbell', primary: 'forearms', isCustom: false },
    // Dumbbell
    { id: 'wrist_curl_db', name: 'Dumbbell Wrist Curl', equipment: 'dumbbells', primary: 'forearms', isCustom: false },
    { id: 'reverse_wrist_curl_db', name: 'Reverse Dumbbell Wrist Curl', equipment: 'dumbbells', primary: 'forearms', isCustom: false },
    { id: 'hammer_curl_forearm', name: 'Hammer Curl (Forearm Focus)', equipment: 'dumbbells', primary: 'forearms', isCustom: false },
    { id: 'zottman_curl_forearm', name: 'Zottman Curl', equipment: 'dumbbells', primary: 'forearms', isCustom: false },
    { id: 'pronation_supination', name: 'Pronation/Supination', equipment: 'dumbbells', primary: 'forearms', isCustom: false },
    { id: 'radial_deviation', name: 'Radial Deviation', equipment: 'dumbbells', primary: 'forearms', isCustom: false },
    { id: 'ulnar_deviation', name: 'Ulnar Deviation', equipment: 'dumbbells', primary: 'forearms', isCustom: false },
    // Cables
    { id: 'cable_wrist_curl', name: 'Cable Wrist Curl', equipment: 'cables', primary: 'forearms', isCustom: false },
    { id: 'reverse_cable_curl', name: 'Reverse Cable Curl', equipment: 'cables', primary: 'forearms', isCustom: false },
    // Machine/Other
    { id: 'wrist_curl_machine', name: 'Wrist Curl Machine', equipment: 'machine', primary: 'forearms', isCustom: false },
    { id: 'gripper', name: 'Hand Gripper', equipment: 'other', primary: 'forearms', isCustom: false },
    { id: 'plate_pinch', name: 'Plate Pinch', equipment: 'other', primary: 'forearms', isCustom: false },
    { id: 'finger_curl', name: 'Finger Curl', equipment: 'other', primary: 'forearms', isCustom: false },
    { id: 'towel_hang', name: 'Towel Hang', equipment: 'other', primary: 'forearms', isCustom: false },
    { id: 'dead_hang', name: 'Dead Hang', equipment: 'bodyweight', primary: 'forearms', isCustom: false },
    { id: 'farmers_walk_forearm', name: 'Farmers Walk (Grip Focus)', equipment: 'other', primary: 'forearms', isCustom: false },
    { id: 'fat_grip_training', name: 'Fat Grip Training', equipment: 'other', primary: 'forearms', isCustom: false },
    { id: 'rice_bucket', name: 'Rice Bucket Exercises', equipment: 'other', primary: 'forearms', isCustom: false },
    { id: 'wrist_extension', name: 'Wrist Extension', equipment: 'other', primary: 'forearms', isCustom: false },
    { id: 'wrist_flexion', name: 'Wrist Flexion', equipment: 'other', primary: 'forearms', isCustom: false },
  ],
};

const DEFAULT_TEMPLATES = {
  ppl_6day: {
    name: 'Push Pull Legs (6 days)',
    days: 6,
    isCustom: false,
    split: [
      { name: 'Push A', muscles: ['chest', 'shoulders', 'triceps'] },
      { name: 'Pull A', muscles: ['back', 'biceps', 'traps', 'forearms'] },
      { name: 'Legs A', muscles: ['quads', 'hamstrings', 'glutes', 'calves'] },
      { name: 'Push B', muscles: ['chest', 'shoulders', 'triceps'] },
      { name: 'Pull B', muscles: ['back', 'biceps', 'traps', 'forearms'] },
      { name: 'Legs B', muscles: ['quads', 'hamstrings', 'glutes', 'calves'] },
    ],
  },
  upper_lower_4day: {
    name: 'Upper Lower (4 days)',
    days: 4,
    isCustom: false,
    split: [
      { name: 'Upper A', muscles: ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'traps'] },
      { name: 'Lower A', muscles: ['quads', 'hamstrings', 'glutes', 'calves', 'abs'] },
      { name: 'Upper B', muscles: ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms'] },
      { name: 'Lower B', muscles: ['quads', 'hamstrings', 'glutes', 'calves', 'abs'] },
    ],
  },
  full_body_3day: {
    name: 'Full Body (3 days)',
    days: 3,
    isCustom: false,
    split: [
      { name: 'Full Body A', muscles: ['chest', 'back', 'shoulders', 'quads', 'hamstrings', 'biceps', 'triceps'] },
      { name: 'Full Body B', muscles: ['chest', 'back', 'shoulders', 'quads', 'glutes', 'biceps', 'triceps'] },
      { name: 'Full Body C', muscles: ['chest', 'back', 'shoulders', 'hamstrings', 'glutes', 'biceps', 'triceps', 'abs'] },
    ],
  },
  bro_split_5day: {
    name: 'Bro Split (5 days)',
    days: 5,
    isCustom: false,
    split: [
      { name: 'Chest', muscles: ['chest'] },
      { name: 'Back', muscles: ['back', 'traps'] },
      { name: 'Shoulders', muscles: ['shoulders'] },
      { name: 'Legs', muscles: ['quads', 'hamstrings', 'glutes', 'calves'] },
      { name: 'Arms', muscles: ['biceps', 'triceps', 'forearms', 'abs'] },
    ],
  },
  arnold_split: {
    name: 'Arnold Split (6 days)',
    days: 6,
    isCustom: false,
    split: [
      { name: 'Chest & Back', muscles: ['chest', 'back'] },
      { name: 'Shoulders & Arms', muscles: ['shoulders', 'biceps', 'triceps'] },
      { name: 'Legs', muscles: ['quads', 'hamstrings', 'glutes', 'calves'] },
      { name: 'Chest & Back', muscles: ['chest', 'back'] },
      { name: 'Shoulders & Arms', muscles: ['shoulders', 'biceps', 'triceps'] },
      { name: 'Legs', muscles: ['quads', 'hamstrings', 'glutes', 'calves'] },
    ],
  },
  torso_limbs: {
    name: 'Torso/Limbs (4 days)',
    days: 4,
    isCustom: false,
    split: [
      { name: 'Torso A', muscles: ['chest', 'back', 'shoulders', 'abs'] },
      { name: 'Limbs A', muscles: ['quads', 'hamstrings', 'biceps', 'triceps', 'calves'] },
      { name: 'Torso B', muscles: ['chest', 'back', 'shoulders', 'traps'] },
      { name: 'Limbs B', muscles: ['quads', 'hamstrings', 'glutes', 'biceps', 'triceps', 'forearms'] },
    ],
  },
};

const MUSCLE_LABELS = {
  chest: 'Chest', back: 'Back', shoulders: 'Shoulders', biceps: 'Biceps',
  triceps: 'Triceps', quads: 'Quadriceps', hamstrings: 'Hamstrings',
  glutes: 'Glutes', calves: 'Calves', abs: 'Abs', traps: 'Traps', forearms: 'Forearms',
};

const EQUIPMENT_OPTIONS = ['barbell', 'dumbbells', 'cables', 'machine', 'bodyweight', 'other'];

const VOLUME_LANDMARKS = {
  chest: { mev: 8, mav: 12, mrv: 20 },
  back: { mev: 10, mav: 14, mrv: 22 },
  shoulders: { mev: 8, mav: 12, mrv: 18 },
  biceps: { mev: 6, mav: 10, mrv: 16 },
  triceps: { mev: 6, mav: 10, mrv: 16 },
  quads: { mev: 8, mav: 12, mrv: 18 },
  hamstrings: { mev: 6, mav: 10, mrv: 16 },
  glutes: { mev: 4, mav: 8, mrv: 14 },
  calves: { mev: 6, mav: 10, mrv: 16 },
  abs: { mev: 4, mav: 8, mrv: 14 },
  traps: { mev: 4, mav: 8, mrv: 12 },
  forearms: { mev: 4, mav: 6, mrv: 10 },
};

// createInitialState, calculateSuggestedWeight, getBestPerformance imported from src/utils/helpers.js

const ProgressionChart = ({ data, title, dataKey, color }) => {
  if (!data || data.length < 2) {
    return (
      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <h4 className="font-semibold text-gray-700 mb-2">{title}</h4>
        <p className="text-gray-400 text-sm text-center py-8">Need more data to show chart</p>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100">
      <h4 className="font-semibold text-gray-700 mb-4">{title}</h4>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#9ca3af" />
          <YAxis tick={{ fontSize: 10 }} stroke="#9ca3af" />
          <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} labelStyle={{ fontWeight: 'bold' }} />
          <Area type="monotone" dataKey={dataKey} stroke={color} fill={`url(#gradient-${dataKey})`} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default function HypertrophyApp() {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem('hypertrophy_state_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...createInitialState(), ...parsed };
      }
    } catch (e) {}
    return createInitialState();
  });
  
  const [currentView, setCurrentView] = useState('home');
  const [restTimer, setRestTimer] = useState(null);
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  const [workoutElapsedTime, setWorkoutElapsedTime] = useState(0);
  const [workoutTimerActive, setWorkoutTimerActive] = useState(false);
  const [newMesoState, setNewMesoState] = useState({ selectedTemplate: 'ppl_6day', weeks: 5, volumeGoal: 'mav' });
  const [workoutFeedbackState, setWorkoutFeedbackState] = useState({ showFeedback: false, feedback: { pump: 3, soreness: 3, performance: 3 } });
  const [exerciseModalState, setExerciseModalState] = useState({
    isOpen: false, mode: 'add', selectedMuscle: 'chest',
    exerciseData: { name: '', equipment: 'barbell', primary: 'chest' },
    targetExerciseIndex: null,
  });
  const [templateModalState, setTemplateModalState] = useState({
    isOpen: false, mode: 'view', selectedTemplate: null, editingTemplate: null, newTemplateName: '',
  });
  const [selectedExerciseForChart, setSelectedExerciseForChart] = useState(null);
  const [confirmState, setConfirmState] = useState({ isOpen: false, title: '', message: '', confirmLabel: 'Confirm', variant: 'danger', onConfirm: null });
  const { toasts, showToast, dismissToast } = useToast();
  const fileInputRef = useRef(null);

  const showConfirm = useCallback((title, message, onConfirm, options = {}) => {
    setConfirmState({
      isOpen: true,
      title,
      message,
      confirmLabel: options.confirmLabel || 'Confirm',
      variant: options.variant || 'danger',
      onConfirm: () => {
        setConfirmState(s => ({ ...s, isOpen: false }));
        onConfirm();
      },
    });
  }, []);

  const allTemplates = useMemo(() => ({ ...DEFAULT_TEMPLATES, ...state.customTemplates }), [state.customTemplates]);
  const getAllTemplates = useCallback(() => allTemplates, [allTemplates]);
  
  const exerciseDatabase = useMemo(() => {
    const combined = {};
    Object.keys(DEFAULT_EXERCISES).forEach(muscle => {
      combined[muscle] = [...DEFAULT_EXERCISES[muscle], ...(state.customExercises[muscle] || [])];
    });
    return combined;
  }, [state.customExercises]);
  const getExerciseDatabase = useCallback(() => exerciseDatabase, [exerciseDatabase]);

  useEffect(() => {
    localStorage.setItem('hypertrophy_state_v3', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    let interval;
    if (restTimer && restTimeLeft > 0) {
      interval = setInterval(() => {
        setRestTimeLeft(prev => {
          if (prev <= 1) {
            setRestTimer(null);
            // Play bell-like sound notification
            try {
              const ctx = new (window.AudioContext || window.webkitAudioContext)();
              const playTone = (freq, startTime, duration) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.frequency.value = freq;
                osc.type = 'sine';
                gain.gain.setValueAtTime(0.5, startTime);
                gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
                osc.start(startTime);
                osc.stop(startTime + duration);
              };
              // Play 3 bell tones
              playTone(830, ctx.currentTime, 0.3);
              playTone(830, ctx.currentTime + 0.35, 0.3);
              playTone(1046, ctx.currentTime + 0.7, 0.5);
            } catch (e) {}
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [restTimer, restTimeLeft]);

  // Workout duration timer
  useEffect(() => {
    let interval;
    if (workoutTimerActive) {
      interval = setInterval(() => {
        setWorkoutElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [workoutTimerActive]);

  const startRestTimer = (seconds) => {
    setRestTimeLeft(seconds || state.settings.restTimer);
    setRestTimer(true);
  };

  const addCustomExercise = (exerciseData) => {
    const { name, equipment, primary } = exerciseData;
    const id = `custom_${Date.now()}`;
    const newExercise = { id, name, equipment, primary, isCustom: true };
    setState(prev => ({
      ...prev,
      customExercises: {
        ...prev.customExercises,
        [primary]: [...(prev.customExercises[primary] || []), newExercise],
      },
    }));
    return newExercise;
  };

  const deleteCustomExercise = (exerciseId, muscle) => {
    setState(prev => ({
      ...prev,
      customExercises: {
        ...prev.customExercises,
        [muscle]: (prev.customExercises[muscle] || []).filter(ex => ex.id !== exerciseId),
      },
    }));
  };

  const saveCustomTemplate = (templateData, templateName) => {
    const id = `custom_${Date.now()}`;
    const newTemplate = {
      ...templateData,
      name: templateName,
      days: templateData.split.length,
      isCustom: true,
    };
    setState(prev => ({
      ...prev,
      customTemplates: { ...prev.customTemplates, [id]: newTemplate },
    }));
    return id;
  };

  const deleteCustomTemplate = (templateId) => {
    setState(prev => {
      const newTemplates = { ...prev.customTemplates };
      delete newTemplates[templateId];
      return { ...prev, customTemplates: newTemplates };
    });
  };

  const generateMesocycle = (template, weeks = 5, volumeGoal = 'mav') => {
    const mesoWeeks = [];
    const allTemplates = getAllTemplates();
    const templateData = allTemplates[template];
    const exerciseDb = getExerciseDatabase();
    
    for (let week = 1; week <= weeks; week++) {
      const weekWorkouts = templateData.split.map((day, dayIndex) => {
        const exercises = [];
        day.muscles.forEach(muscle => {
          const muscleExercises = exerciseDb[muscle];
          if (muscleExercises && muscleExercises.length > 0) {
            const numExercises = muscle === 'abs' || muscle === 'calves' || muscle === 'forearms' || muscle === 'traps' ? 1 : 2;
            const selected = muscleExercises.slice(0, numExercises);
            selected.forEach((ex) => {
              const landmark = VOLUME_LANDMARKS[muscle];
              const startSets = Math.ceil(landmark.mev / templateData.days);
              const endSets = Math.ceil(landmark[volumeGoal] / templateData.days);
              const setsPerWeek = Math.round(startSets + (endSets - startSets) * ((week - 1) / (weeks - 1)));
              const sets = week === weeks ? Math.max(2, Math.round(setsPerWeek * 0.6)) : Math.max(2, setsPerWeek);
              const targetRIR = week === weeks ? 4 : Math.max(0, 4 - Math.floor((week - 1) * 1.2));
              exercises.push({
                exerciseId: ex.id, name: ex.name, muscle,
                sets: Array(sets).fill(null).map(() => ({
                  targetReps: 10, targetRIR, weight: null, reps: null, rir: null, completed: false, suggestedWeight: null,
                })),
              });
            });
          }
        });
        return { id: `week${week}_day${dayIndex + 1}`, name: day.name, dayNumber: dayIndex + 1, exercises, completed: false, feedback: null };
      });
      mesoWeeks.push({ weekNumber: week, isDeload: week === weeks, workouts: weekWorkouts });
    }
    return {
      id: Date.now().toString(), template, templateName: templateData.name, weeks, volumeGoal,
      startDate: new Date().toISOString(), weeksData: mesoWeeks, currentWeek: 1, currentDay: 1,
    };
  };

  const startMesocycle = (template, weeks, volumeGoal) => {
    const meso = generateMesocycle(template, weeks, volumeGoal);
    setState(prev => ({ ...prev, mesocycle: meso }));
    setCurrentView('workout');
  };

  const getCurrentWorkout = () => {
    if (!state.mesocycle) return null;
    const week = state.mesocycle.weeksData[state.mesocycle.currentWeek - 1];
    if (!week) return null;
    return week.workouts[state.mesocycle.currentDay - 1];
  };

  const startWorkout = () => {
    const workout = getCurrentWorkout();
    if (!workout) return;
    setWorkoutFeedbackState({ showFeedback: false, feedback: { pump: 3, soreness: 3, performance: 3 } });
    setWorkoutElapsedTime(0);
    setWorkoutTimerActive(true);
    const workoutWithSuggestions = {
      ...workout,
      startTime: new Date().toISOString(),
      exercises: workout.exercises.map(ex => ({
        ...ex,
        sets: ex.sets.map(set => {
          const history = state.exerciseHistory[ex.exerciseId];
          const suggestedWeight = calculateSuggestedWeight(history, set.targetReps, set.targetRIR, state.settings);
          return { ...set, suggestedWeight, weight: suggestedWeight };
        }),
      })),
    };
    setState(prev => ({ ...prev, activeWorkout: workoutWithSuggestions }));
    setCurrentView('active_workout');
  };

  const updateSet = (exerciseIndex, setIndex, field, value) => {
    setState(prev => {
      const newWorkout = { ...prev.activeWorkout };
      newWorkout.exercises = [...newWorkout.exercises];
      newWorkout.exercises[exerciseIndex] = {
        ...newWorkout.exercises[exerciseIndex],
        sets: [...newWorkout.exercises[exerciseIndex].sets],
      };
      newWorkout.exercises[exerciseIndex].sets[setIndex] = {
        ...newWorkout.exercises[exerciseIndex].sets[setIndex],
        [field]: value,
      };
      return { ...prev, activeWorkout: newWorkout };
    });
  };

  const completeSet = (exerciseIndex, setIndex) => {
    const exercise = state.activeWorkout.exercises[exerciseIndex];
    const set = exercise.sets[setIndex];
    if (set.weight && set.reps) {
      setState(prev => {
        const history = prev.exerciseHistory[exercise.exerciseId] || [];
        return {
          ...prev,
          exerciseHistory: {
            ...prev.exerciseHistory,
            [exercise.exerciseId]: [...history, { date: new Date().toISOString(), weight: set.weight, reps: set.reps, rir: set.rir }].slice(-100),
          },
        };
      });
    }
    updateSet(exerciseIndex, setIndex, 'completed', true);
    startRestTimer();
  };

  const replaceExercise = (exerciseIndex, newExercise) => {
    setState(prev => {
      const newWorkout = { ...prev.activeWorkout };
      newWorkout.exercises = [...newWorkout.exercises];
      const oldExercise = newWorkout.exercises[exerciseIndex];
      const history = prev.exerciseHistory[newExercise.id];
      newWorkout.exercises[exerciseIndex] = {
        ...oldExercise,
        exerciseId: newExercise.id,
        name: newExercise.name,
        sets: oldExercise.sets.map(set => {
          const suggestedWeight = calculateSuggestedWeight(history, set.targetReps, set.targetRIR, prev.settings);
          return { ...set, suggestedWeight, weight: set.completed ? set.weight : suggestedWeight, completed: false };
        }),
      };
      return { ...prev, activeWorkout: newWorkout };
    });
  };

  const addSetToExercise = (exerciseIndex) => {
    setState(prev => {
      const newWorkout = { ...prev.activeWorkout };
      newWorkout.exercises = [...newWorkout.exercises];
      const exercise = newWorkout.exercises[exerciseIndex];
      const lastSet = exercise.sets[exercise.sets.length - 1];
      const history = prev.exerciseHistory[exercise.exerciseId];
      const suggestedWeight = lastSet?.weight || calculateSuggestedWeight(history, lastSet?.targetReps || 10, lastSet?.targetRIR || 2, prev.settings);
      
      newWorkout.exercises[exerciseIndex] = {
        ...exercise,
        sets: [...exercise.sets, {
          targetReps: lastSet?.targetReps || 10,
          targetRIR: lastSet?.targetRIR || 2,
          weight: suggestedWeight,
          reps: null,
          rir: null,
          completed: false,
          suggestedWeight,
        }],
      };
      return { ...prev, activeWorkout: newWorkout };
    });
  };

  const removeSetFromExercise = (exerciseIndex, setIndex) => {
    setState(prev => {
      const newWorkout = { ...prev.activeWorkout };
      newWorkout.exercises = [...newWorkout.exercises];
      const exercise = newWorkout.exercises[exerciseIndex];
      if (exercise.sets.length <= 1) return prev; // Keep at least one set
      
      newWorkout.exercises[exerciseIndex] = {
        ...exercise,
        sets: exercise.sets.filter((_, idx) => idx !== setIndex),
      };
      return { ...prev, activeWorkout: newWorkout };
    });
  };

  const addExerciseToWorkout = (newExercise, muscle) => {
    setState(prev => {
      const newWorkout = { ...prev.activeWorkout };
      const history = prev.exerciseHistory[newExercise.id];
      const suggestedWeight = calculateSuggestedWeight(history, 10, 2, prev.settings);
      
      newWorkout.exercises = [...newWorkout.exercises, {
        exerciseId: newExercise.id,
        name: newExercise.name,
        muscle: muscle,
        sets: [{
          targetReps: 10,
          targetRIR: 2,
          weight: suggestedWeight,
          reps: null,
          rir: null,
          completed: false,
          suggestedWeight,
        }, {
          targetReps: 10,
          targetRIR: 2,
          weight: suggestedWeight,
          reps: null,
          rir: null,
          completed: false,
          suggestedWeight,
        }],
      }];
      return { ...prev, activeWorkout: newWorkout };
    });
  };

  const removeExerciseFromWorkout = (exerciseIndex) => {
    setState(prev => {
      const newWorkout = { ...prev.activeWorkout };
      if (newWorkout.exercises.length <= 1) return prev; // Keep at least one exercise
      newWorkout.exercises = newWorkout.exercises.filter((_, idx) => idx !== exerciseIndex);
      return { ...prev, activeWorkout: newWorkout };
    });
  };

  const finishWorkout = (feedback) => {
    const workout = state.activeWorkout;
    if (!workout) return;
    setWorkoutTimerActive(false);
    const completedWorkout = { 
      ...workout, 
      endTime: new Date().toISOString(), 
      feedback, 
      completed: true,
      durationSeconds: workoutElapsedTime 
    };
    setState(prev => {
      const newMeso = { ...prev.mesocycle };
      newMeso.weeksData = [...newMeso.weeksData];
      const weekIdx = newMeso.currentWeek - 1;
      newMeso.weeksData[weekIdx] = { ...newMeso.weeksData[weekIdx], workouts: [...newMeso.weeksData[weekIdx].workouts] };
      newMeso.weeksData[weekIdx].workouts[newMeso.currentDay - 1] = completedWorkout;
      if (newMeso.currentDay < newMeso.weeksData[weekIdx].workouts.length) {
        newMeso.currentDay += 1;
      } else if (newMeso.currentWeek < newMeso.weeks) {
        newMeso.currentWeek += 1;
        newMeso.currentDay = 1;
      }
      return { ...prev, mesocycle: newMeso, activeWorkout: null, history: [...prev.history, completedWorkout] };
    });
    setWorkoutElapsedTime(0);
    setCurrentView('workout');
  };

  const getProgressionData = useCallback((exerciseId) => {
    const history = state.exerciseHistory[exerciseId] || [];
    return getProgressionDataHelper(history);
  }, [state.exerciseHistory]);

  const getOverallVolumeData = useCallback(() => {
    return getOverallVolumeDataHelper(state.history);
  }, [state.history]);

  const renderTemplateModal = () => {
    if (!templateModalState.isOpen) return null;
    const { mode, selectedTemplate, editingTemplate, newTemplateName } = templateModalState;
    const allTemplates = getAllTemplates();
    
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
        <div className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl max-h-[85vh] overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-bold text-lg">
              {mode === 'view' ? 'Manage Templates' : mode === 'edit' ? 'Edit Template' : 'Create Template'}
            </h3>
            <button onClick={() => setTemplateModalState(s => ({ ...s, isOpen: false }))} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4 overflow-y-auto max-h-[70vh]">
            {mode === 'view' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">Select a template to edit or create a new one</p>
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Default Templates</p>
                  {Object.entries(DEFAULT_TEMPLATES).map(([key, t]) => (
                    <div key={key} className="p-3 border border-gray-200 rounded-xl flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-900">{t.name}</p>
                        <p className="text-xs text-gray-500">{t.days} days • {t.split.map(d => d.name).join(', ')}</p>
                      </div>
                      <button onClick={() => setTemplateModalState(s => ({ ...s, mode: 'edit', selectedTemplate: key, editingTemplate: JSON.parse(JSON.stringify(t)), newTemplateName: t.name + ' (Custom)' }))} className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                {Object.keys(state.customTemplates).length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Custom Templates</p>
                    {Object.entries(state.customTemplates).map(([key, t]) => (
                      <div key={key} className="p-3 border border-gray-200 rounded-xl flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-gray-900">{t.name}</p>
                          <p className="text-xs text-gray-500">{t.days} days</p>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => setTemplateModalState(s => ({ ...s, mode: 'edit', selectedTemplate: key, editingTemplate: JSON.parse(JSON.stringify(t)), newTemplateName: t.name }))} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button onClick={() => deleteCustomTemplate(key)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <button onClick={() => setTemplateModalState(s => ({ ...s, mode: 'edit', selectedTemplate: null, editingTemplate: { name: '', split: [{ name: 'Day 1', muscles: [] }] }, newTemplateName: 'My Custom Template' }))} className="w-full border-2 border-dashed border-gray-300 text-gray-600 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:border-orange-500 hover:text-orange-500">
                  <Plus className="w-4 h-4" /> Create New Template
                </button>
              </div>
            )}
            {mode === 'edit' && editingTemplate && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Template Name</label>
                  <input type="text" value={newTemplateName} onChange={e => setTemplateModalState(s => ({ ...s, newTemplateName: e.target.value }))} className="w-full p-3 border border-gray-200 rounded-xl" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-semibold text-gray-700">Workout Days</p>
                    <button onClick={() => setTemplateModalState(s => ({ ...s, editingTemplate: { ...s.editingTemplate, split: [...s.editingTemplate.split, { name: `Day ${s.editingTemplate.split.length + 1}`, muscles: [] }] } }))} className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-lg flex items-center gap-1">
                      <Plus className="w-3 h-3" /> Add Day
                    </button>
                  </div>
                  {editingTemplate.split.map((day, dayIdx) => (
                    <div key={dayIdx} className="border border-gray-200 rounded-xl p-3">
                      <div className="flex justify-between items-center mb-2">
                        <input type="text" value={day.name} onChange={e => { const newSplit = [...editingTemplate.split]; newSplit[dayIdx] = { ...newSplit[dayIdx], name: e.target.value }; setTemplateModalState(s => ({ ...s, editingTemplate: { ...s.editingTemplate, split: newSplit } })); }} className="font-semibold text-gray-900 bg-transparent border-b border-gray-200 focus:border-orange-500 outline-none" />
                        {editingTemplate.split.length > 1 && (
                          <button onClick={() => { const newSplit = editingTemplate.split.filter((_, i) => i !== dayIdx); setTemplateModalState(s => ({ ...s, editingTemplate: { ...s.editingTemplate, split: newSplit } })); }} className="p-1 text-red-500 hover:bg-red-50 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(MUSCLE_LABELS).map(([muscle, label]) => (
                          <button key={muscle} onClick={() => { const newSplit = [...editingTemplate.split]; const muscles = newSplit[dayIdx].muscles; if (muscles.includes(muscle)) { newSplit[dayIdx] = { ...newSplit[dayIdx], muscles: muscles.filter(m => m !== muscle) }; } else { newSplit[dayIdx] = { ...newSplit[dayIdx], muscles: [...muscles, muscle] }; } setTemplateModalState(s => ({ ...s, editingTemplate: { ...s.editingTemplate, split: newSplit } })); }} className={`text-xs px-2 py-1 rounded-full ${day.muscles.includes(muscle) ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setTemplateModalState(s => ({ ...s, mode: 'view' }))} className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl">Cancel</button>
                  <button onClick={() => { if (newTemplateName.trim() && editingTemplate.split.length > 0) { saveCustomTemplate(editingTemplate, newTemplateName); setTemplateModalState(s => ({ ...s, mode: 'view', editingTemplate: null })); } }} disabled={!newTemplateName.trim()} className="flex-1 bg-orange-500 text-white font-semibold py-3 rounded-xl disabled:bg-gray-300 flex items-center justify-center gap-2">
                    <Save className="w-4 h-4" /> Save Template
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderExerciseModal = () => {
    if (!exerciseModalState.isOpen) return null;
    const { mode, selectedMuscle, exerciseData, targetExerciseIndex } = exerciseModalState;
    const exerciseDb = getExerciseDatabase();
    
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
        <div className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl max-h-[80vh] overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-bold text-lg">{mode === 'add' ? 'Add Custom Exercise' : mode === 'select' ? 'Select Exercise' : mode === 'add_to_workout' ? 'Add Exercise to Workout' : 'Manage Exercises'}</h3>
            <button onClick={() => setExerciseModalState(s => ({ ...s, isOpen: false }))} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
          </div>
          <div className="p-4 overflow-y-auto max-h-[60vh]">
            {mode === 'add' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Exercise Name</label>
                  <input type="text" value={exerciseData.name} onChange={e => setExerciseModalState(s => ({ ...s, exerciseData: { ...s.exerciseData, name: e.target.value } }))} placeholder="e.g., Incline Smith Machine Press" className="w-full p-3 border border-gray-200 rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Target Muscle</label>
                  <select value={exerciseData.primary} onChange={e => setExerciseModalState(s => ({ ...s, exerciseData: { ...s.exerciseData, primary: e.target.value } }))} className="w-full p-3 border border-gray-200 rounded-xl">
                    {Object.entries(MUSCLE_LABELS).map(([key, label]) => (<option key={key} value={key}>{label}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Equipment</label>
                  <select value={exerciseData.equipment} onChange={e => setExerciseModalState(s => ({ ...s, exerciseData: { ...s.exerciseData, equipment: e.target.value } }))} className="w-full p-3 border border-gray-200 rounded-xl">
                    {EQUIPMENT_OPTIONS.map(eq => (<option key={eq} value={eq}>{eq.charAt(0).toUpperCase() + eq.slice(1)}</option>))}
                  </select>
                </div>
                <button onClick={() => { if (exerciseData.name.trim()) { addCustomExercise(exerciseData); setExerciseModalState(s => ({ ...s, isOpen: false, exerciseData: { name: '', equipment: 'barbell', primary: 'chest' } })); } }} disabled={!exerciseData.name.trim()} className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl disabled:bg-gray-300">Add Exercise</button>
              </div>
            )}
            {mode === 'select' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Filter by Muscle</label>
                  <select value={selectedMuscle} onChange={e => setExerciseModalState(s => ({ ...s, selectedMuscle: e.target.value }))} className="w-full p-3 border border-gray-200 rounded-xl">
                    {Object.entries(MUSCLE_LABELS).map(([key, label]) => (<option key={key} value={key}>{label}</option>))}
                  </select>
                </div>
                <div className="space-y-2">
                  {(exerciseDb[selectedMuscle] || []).map(ex => {
                    const history = state.exerciseHistory[ex.id];
                    const best = getBestPerformance(history);
                    return (
                      <button key={ex.id} onClick={() => { if (targetExerciseIndex !== null) replaceExercise(targetExerciseIndex, ex); setExerciseModalState(s => ({ ...s, isOpen: false })); }} className="w-full p-3 border border-gray-200 rounded-xl text-left hover:border-orange-500 hover:bg-orange-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-gray-900">{ex.name}</p>
                            <p className="text-xs text-gray-500">{ex.equipment} {ex.isCustom && '• Custom'}</p>
                          </div>
                          {best && (<div className="text-right"><p className="text-xs text-gray-500">Best</p><p className="text-sm font-bold text-orange-600">{best.weight}kg × {best.reps}</p></div>)}
                        </div>
                      </button>
                    );
                  })}
                </div>
                <button onClick={() => setExerciseModalState(s => ({ ...s, mode: 'add' }))} className="w-full border-2 border-dashed border-gray-300 text-gray-600 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:border-orange-500 hover:text-orange-500">
                  <Plus className="w-4 h-4" /> Create Custom Exercise
                </button>
              </div>
            )}
            {mode === 'view' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Muscle Group</label>
                  <select value={selectedMuscle} onChange={e => setExerciseModalState(s => ({ ...s, selectedMuscle: e.target.value }))} className="w-full p-3 border border-gray-200 rounded-xl">
                    {Object.entries(MUSCLE_LABELS).map(([key, label]) => (<option key={key} value={key}>{label}</option>))}
                  </select>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 mb-2">
                  <p className="text-sm text-gray-600"><span className="font-bold text-orange-600">{(exerciseDb[selectedMuscle] || []).length}</span> exercises available for {MUSCLE_LABELS[selectedMuscle]}</p>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  <p className="text-sm font-semibold text-gray-500 sticky top-0 bg-white py-1">All Exercises</p>
                  {(exerciseDb[selectedMuscle] || []).map(ex => {
                    const history = state.exerciseHistory[ex.id];
                    const best = getBestPerformance(history);
                    return (
                      <div key={ex.id} className="p-3 border border-gray-200 rounded-xl flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-gray-900">{ex.name}</p>
                          <p className="text-xs text-gray-500">{ex.equipment}{ex.isCustom && ' • Custom'}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {best && <span className="text-xs text-green-600 font-semibold">{best.weight}kg</span>}
                          {ex.isCustom && (
                            <button onClick={() => deleteCustomExercise(ex.id, selectedMuscle)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button onClick={() => setExerciseModalState(s => ({ ...s, mode: 'add' }))} className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> Add Custom Exercise
                </button>
              </div>
            )}
            {mode === 'add_to_workout' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Select Muscle Group</label>
                  <select value={selectedMuscle} onChange={e => setExerciseModalState(s => ({ ...s, selectedMuscle: e.target.value }))} className="w-full p-3 border border-gray-200 rounded-xl">
                    {Object.entries(MUSCLE_LABELS).map(([key, label]) => (<option key={key} value={key}>{label}</option>))}
                  </select>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {(exerciseDb[selectedMuscle] || []).map(ex => {
                    const history = state.exerciseHistory[ex.id];
                    const best = getBestPerformance(history);
                    return (
                      <button key={ex.id} onClick={() => { addExerciseToWorkout(ex, selectedMuscle); setExerciseModalState(s => ({ ...s, isOpen: false })); }} className="w-full p-3 border border-gray-200 rounded-xl text-left hover:border-green-500 hover:bg-green-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-gray-900">{ex.name}</p>
                            <p className="text-xs text-gray-500">{ex.equipment} {ex.isCustom && '• Custom'}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {best && <span className="text-xs text-green-600 font-semibold">{best.weight}kg</span>}
                            <Plus className="w-5 h-5 text-green-500" />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderHome = () => {
    const totalExercises = Object.values(DEFAULT_EXERCISES).reduce((sum, arr) => sum + arr.length, 0);
    return (
    <div className="p-6 space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-full mb-4">
          <Flame className="w-5 h-5" /><span className="font-bold">HYPERTROPHY PRO</span>
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">Build Muscle Smarter</h1>
        <p className="text-gray-600">AI-powered progressive overload & volume management</p>
        <p className="text-xs text-orange-600 mt-1">{totalExercises}+ exercises • 12 muscle groups</p>
      </div>
      {state.mesocycle ? (
        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white">
          <div className="flex justify-between items-start mb-4">
            <div><p className="text-orange-100 text-sm">Current Program</p><h2 className="text-xl font-bold">{state.mesocycle.templateName}</h2></div>
            <div className="text-right"><p className="text-orange-100 text-sm">Week</p><p className="text-2xl font-black">{state.mesocycle.currentWeek}/{state.mesocycle.weeks}</p></div>
          </div>
          <div className="bg-white/20 rounded-xl p-4 mb-4">
            <p className="text-sm text-orange-100 mb-1">Next Workout</p>
            <p className="font-bold text-lg">{getCurrentWorkout()?.name || 'Complete!'}</p>
            <p className="text-sm text-orange-100">{state.mesocycle.weeksData[state.mesocycle.currentWeek - 1]?.isDeload ? '🔄 Deload Week' : `Day ${state.mesocycle.currentDay}`}</p>
          </div>
          <button onClick={() => setCurrentView('workout')} className="w-full bg-white text-orange-600 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-orange-50">
            <Play className="w-5 h-5" /> Continue Training
          </button>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-2xl p-6 border-2 border-dashed border-gray-200 text-center">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="font-bold text-gray-700 mb-2">No Active Program</h3>
          <p className="text-gray-500 text-sm mb-4">Start a new mesocycle to begin training</p>
          <button onClick={() => setCurrentView('new_meso')} className="bg-orange-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-orange-600">Create Program</button>
        </div>
      )}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg"><Calendar className="w-5 h-5 text-blue-600" /></div>
            <div><p className="text-2xl font-black text-gray-900">{state.history.length}</p><p className="text-xs text-gray-500">Workouts</p></div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg"><TrendingUp className="w-5 h-5 text-green-600" /></div>
            <div><p className="text-2xl font-black text-gray-900">{getTotalCompletedSets(state.history)}</p><p className="text-xs text-gray-500">Total Sets</p></div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-lg"><Clock className="w-5 h-5 text-purple-600" /></div>
            <div><p className="text-2xl font-black text-gray-900">{getAverageWorkoutDuration(state.history)}</p><p className="text-xs text-gray-500">Avg Min</p></div>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <button onClick={() => setExerciseModalState({ isOpen: true, mode: 'view', selectedMuscle: 'chest', exerciseData: { name: '', equipment: 'barbell', primary: 'chest' }, targetExerciseIndex: null })} className="w-full bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center justify-between hover:border-orange-300">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-lg"><Dumbbell className="w-5 h-5 text-purple-600" /></div>
            <div className="text-left"><p className="font-semibold text-gray-900">Exercise Library</p><p className="text-xs text-gray-500">{totalExercises}+ exercises available</p></div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
        <button onClick={() => setTemplateModalState({ isOpen: true, mode: 'view', selectedTemplate: null, editingTemplate: null, newTemplateName: '' })} className="w-full bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center justify-between hover:border-orange-300">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg"><Copy className="w-5 h-5 text-blue-600" /></div>
            <div className="text-left"><p className="font-semibold text-gray-900">Manage Templates</p><p className="text-xs text-gray-500">{Object.keys(getAllTemplates()).length} templates available</p></div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </div>
  )};

  const renderNewMeso = () => {
    const { selectedTemplate, weeks, volumeGoal } = newMesoState;
    const allTemplates = getAllTemplates();
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setCurrentView('home')} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronLeft className="w-5 h-5" /></button>
          <h2 className="text-xl font-bold">New Mesocycle</h2>
        </div>
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-semibold text-gray-700">Training Split</label>
            <button onClick={() => setTemplateModalState({ isOpen: true, mode: 'view', selectedTemplate: null, editingTemplate: null, newTemplateName: '' })} className="text-xs text-orange-500 font-semibold">+ Create Custom</button>
          </div>
          <div className="space-y-2">
            {Object.entries(allTemplates).map(([key, t]) => (
              <button key={key} onClick={() => setNewMesoState(s => ({ ...s, selectedTemplate: key }))} className={`w-full p-4 rounded-xl border-2 text-left ${selectedTemplate === key ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="flex justify-between items-center">
                  <div><p className="font-bold text-gray-900">{t.name}</p><p className="text-sm text-gray-500">{t.days} days per week {t.isCustom && '• Custom'}</p></div>
                  {selectedTemplate === key && <div className="bg-orange-500 text-white p-1 rounded-full"><Check className="w-4 h-4" /></div>}
                </div>
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Mesocycle Length</label>
          <div className="flex gap-2">
            {[4, 5, 6].map(w => (
              <button key={w} onClick={() => setNewMesoState(s => ({ ...s, weeks: w }))} className={`flex-1 p-3 rounded-xl border-2 font-bold ${weeks === w ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-200 hover:border-gray-300'}`}>{w} Weeks</button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">* Last week is always a deload</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Volume Target</label>
          <div className="space-y-2">
            {[
              { key: 'mev', name: 'MEV (Minimum)', desc: 'Minimum Effective Volume - maintenance' },
              { key: 'mav', name: 'MAV (Maximum Adaptive)', desc: 'Best volume for most people' },
              { key: 'mrv', name: 'MRV (Maximum)', desc: 'High volume - advanced lifters only' },
            ].map(v => (
              <button key={v.key} onClick={() => setNewMesoState(s => ({ ...s, volumeGoal: v.key }))} className={`w-full p-4 rounded-xl border-2 text-left ${volumeGoal === v.key ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="flex justify-between items-center">
                  <div><p className="font-bold text-gray-900">{v.name}</p><p className="text-sm text-gray-500">{v.desc}</p></div>
                  {volumeGoal === v.key && <div className="bg-orange-500 text-white p-1 rounded-full"><Check className="w-4 h-4" /></div>}
                </div>
              </button>
            ))}
          </div>
        </div>
        <button onClick={() => startMesocycle(selectedTemplate, weeks, volumeGoal)} className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-4 rounded-xl hover:opacity-90 flex items-center justify-center gap-2">
          <Zap className="w-5 h-5" /> Start Mesocycle
        </button>
      </div>
    );
  };

  const renderWorkout = () => {
    if (!state.mesocycle) {
      return (<div className="p-6 text-center"><p>No active program. Start a new mesocycle first.</p><button onClick={() => setCurrentView('new_meso')} className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-xl">Create Program</button></div>);
    }
    const workout = getCurrentWorkout();
    const week = state.mesocycle.weeksData[state.mesocycle.currentWeek - 1];
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Week {state.mesocycle.currentWeek} of {state.mesocycle.weeks}</p>
            <h2 className="text-2xl font-bold text-gray-900">{workout?.name || 'Program Complete!'}</h2>
            {week?.isDeload && <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded mt-1">DELOAD WEEK</span>}
          </div>
          <button onClick={() => setCurrentView('home')} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex gap-1">
          {week?.workouts.map((w, i) => (<div key={i} className={`flex-1 h-2 rounded-full ${w.completed ? 'bg-green-500' : i === state.mesocycle.currentDay - 1 ? 'bg-orange-500' : 'bg-gray-200'}`} />))}
        </div>
        {workout && !workout.completed ? (
          <>
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700">Today's Exercises</h3>
              {workout.exercises.map((ex, i) => {
                const history = state.exerciseHistory[ex.exerciseId];
                const lastWeight = history && history.length > 0 ? history[history.length - 1].weight : null;
                return (
                  <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-gray-900">{ex.name}</p>
                        <p className="text-sm text-gray-500">{MUSCLE_LABELS[ex.muscle]}</p>
                        {lastWeight && <p className="text-xs text-green-600 mt-1">💪 Last: {lastWeight}kg</p>}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-orange-600">{ex.sets.length} sets</p>
                        <p className="text-xs text-gray-500">RIR {ex.sets[0]?.targetRIR}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <button onClick={startWorkout} className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-4 rounded-xl hover:opacity-90 flex items-center justify-center gap-2">
              <Play className="w-5 h-5" /> Start Workout
            </button>
          </>
        ) : (
          <div className="text-center py-8">
            <Award className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">{state.mesocycle.currentWeek >= state.mesocycle.weeks ? 'Mesocycle Complete!' : 'Workout Complete!'}</h3>
            <p className="text-gray-500 mb-4">Great work! Rest up for your next session.</p>
            {state.mesocycle.currentWeek >= state.mesocycle.weeks && (<button onClick={() => setCurrentView('new_meso')} className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold">Start New Mesocycle</button>)}
          </div>
        )}
      </div>
    );
  };

  const renderActiveWorkout = () => {
    const { showFeedback, feedback } = workoutFeedbackState;
    if (!state.activeWorkout) return null;
    if (showFeedback) {
      return (
        <div className="p-6 space-y-6">
          <h2 className="text-xl font-bold">Workout Feedback</h2>
          <p className="text-gray-600">How was your workout? This helps optimize your next session.</p>
          {[
            { key: 'pump', label: 'Pump Quality', low: 'No pump', high: 'Best pump ever' },
            { key: 'soreness', label: 'Current Soreness', low: 'Not sore', high: 'Very sore' },
            { key: 'performance', label: 'Performance', low: 'Struggled', high: 'Crushed it' },
          ].map(({ key, label, low, high }) => (
            <div key={key}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-16">{low}</span>
                <div className="flex-1 flex gap-1">
                  {[1, 2, 3, 4, 5].map(v => (
                    <button key={v} onClick={() => setWorkoutFeedbackState(s => ({ ...s, feedback: { ...s.feedback, [key]: v } }))} className={`flex-1 h-10 rounded-lg font-bold ${feedback[key] === v ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{v}</button>
                  ))}
                </div>
                <span className="text-xs text-gray-500 w-16 text-right">{high}</span>
              </div>
            </div>
          ))}
          <button onClick={() => finishWorkout(feedback)} className="w-full bg-green-500 text-white font-bold py-4 rounded-xl hover:bg-green-600">Complete Workout</button>
        </div>
      );
    }
    const allCompleted = state.activeWorkout.exercises.every(ex => ex.sets.every(s => s.completed));
    // formatDuration imported from helpers
    return (
      <div className="pb-32">
        <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-orange-100 text-sm">Active Workout</p>
              <h2 className="text-2xl font-bold">{state.activeWorkout.name}</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 px-3 py-2 rounded-lg flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="font-mono font-bold">{formatDuration(workoutElapsedTime)}</span>
              </div>
              <button onClick={() => setWorkoutFeedbackState(s => ({ ...s, showFeedback: true }))} className="bg-white/20 px-4 py-2 rounded-lg text-sm font-semibold">Finish</button>
            </div>
          </div>
        </div>
        {restTimer ? (
          <div className="bg-blue-500 text-white p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3"><Clock className="w-5 h-5" /><span className="font-bold">Rest Timer</span></div>
              <button onClick={() => { setRestTimer(null); setRestTimeLeft(0); }} className="bg-white/20 p-2 rounded-lg hover:bg-white/30"><X className="w-4 h-4" /></button>
            </div>
            <div className="flex items-center justify-center gap-4">
              <button onClick={() => setRestTimeLeft(prev => Math.max(0, prev - 15))} className="bg-white/20 p-3 rounded-full hover:bg-white/30"><Minus className="w-5 h-5" /></button>
              <span className="text-4xl font-mono font-bold w-28 text-center">{Math.floor(restTimeLeft / 60)}:{(restTimeLeft % 60).toString().padStart(2, '0')}</span>
              <button onClick={() => setRestTimeLeft(prev => prev + 15)} className="bg-white/20 p-3 rounded-full hover:bg-white/30"><Plus className="w-5 h-5" /></button>
            </div>
            <div className="flex justify-center gap-2 mt-3">
              {[60, 90, 120, 180].map(sec => (
                <button key={sec} onClick={() => setRestTimeLeft(sec)} className={`px-3 py-1 rounded-full text-sm font-semibold ${restTimeLeft === sec ? 'bg-white text-blue-500' : 'bg-white/20 hover:bg-white/30'}`}>
                  {sec < 60 ? `${sec}s` : `${sec/60}m`}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-gray-100 p-3 flex items-center justify-between">
            <span className="text-sm text-gray-600 font-medium">Rest Timer</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">{state.settings.restTimer}s</span>
              <button onClick={() => startRestTimer()} className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-blue-600">
                <Play className="w-4 h-4" /> Start
              </button>
            </div>
          </div>
        )}
        <div className="p-4 space-y-6">
          {state.activeWorkout.exercises.map((exercise, exIdx) => {
            const history = state.exerciseHistory[exercise.exerciseId];
            const best = getBestPerformance(history);
            return (
              <div key={exIdx} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="bg-gray-50 p-4 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900">{exercise.name}</h3>
                        <button onClick={() => setExerciseModalState({ isOpen: true, mode: 'select', selectedMuscle: exercise.muscle, exerciseData: { name: '', equipment: 'barbell', primary: exercise.muscle }, targetExerciseIndex: exIdx })} className="p-1 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded"><Edit3 className="w-4 h-4" /></button>
                      </div>
                      <p className="text-sm text-gray-500">{MUSCLE_LABELS[exercise.muscle]} • Target RIR: {exercise.sets[0]?.targetRIR}</p>
                      {best && <p className="text-xs text-green-600 mt-1">🏆 PR: {best.weight}kg × {best.reps} (E1RM: {best.e1rm}kg)</p>}
                    </div>
                    <div className="text-right"><p className="text-sm text-gray-500">{exercise.sets.filter(s => s.completed).length}/{exercise.sets.length} sets</p></div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-gray-500 mb-2 px-2">
                    <div className="col-span-1">Set</div>
                    <div className="col-span-3 text-center">Weight</div>
                    <div className="col-span-3 text-center">Reps</div>
                    <div className="col-span-3 text-center">RIR</div>
                    <div className="col-span-2"></div>
                  </div>
                  {exercise.sets.map((set, setIdx) => (
                    <div key={setIdx} className={`grid grid-cols-12 gap-2 items-center py-2 px-2 rounded-lg mb-1 ${set.completed ? 'bg-green-50' : 'hover:bg-gray-50'}`}>
                      <div className="col-span-1 font-bold text-gray-700 flex items-center gap-1">
                        {setIdx + 1}
                        {!set.completed && exercise.sets.length > 1 && (
                          <button onClick={() => removeSetFromExercise(exIdx, setIdx)} className="text-red-400 hover:text-red-600 p-0.5">
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <div className="col-span-3">
                        <div className="relative">
                          <input type="number" placeholder={set.suggestedWeight ? `${set.suggestedWeight}` : 'kg'} value={set.weight || ''} disabled={set.completed} onChange={e => updateSet(exIdx, setIdx, 'weight', parseFloat(e.target.value) || null)} className={`w-full p-2 border rounded-lg text-center text-sm font-semibold disabled:bg-gray-100 ${set.suggestedWeight && !set.weight ? 'border-orange-300 bg-orange-50' : 'border-gray-200'}`} />
                          {set.suggestedWeight && !set.completed && !set.weight && <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs px-1 rounded">💡</span>}
                        </div>
                      </div>
                      <div className="col-span-3">
                        <input type="number" placeholder={`${set.targetReps}`} value={set.reps || ''} disabled={set.completed} onChange={e => updateSet(exIdx, setIdx, 'reps', parseInt(e.target.value) || null)} className="w-full p-2 border border-gray-200 rounded-lg text-center text-sm font-semibold disabled:bg-gray-100" />
                      </div>
                      <div className="col-span-3">
                        <select value={set.rir ?? ''} disabled={set.completed} onChange={e => updateSet(exIdx, setIdx, 'rir', parseInt(e.target.value))} className="w-full p-2 border border-gray-200 rounded-lg text-center text-sm font-semibold disabled:bg-gray-100">
                          <option value="">{set.targetRIR}</option>
                          {[0, 1, 2, 3, 4, 5].map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>
                      <div className="col-span-2">
                        <button onClick={() => completeSet(exIdx, setIdx)} disabled={set.completed || !set.weight || !set.reps} className={`w-full p-2 rounded-lg ${set.completed ? 'bg-green-500 text-white' : 'bg-orange-500 text-white hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400'}`}>
                          <Check className="w-4 h-4 mx-auto" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => addSetToExercise(exIdx)} className="w-full mt-2 py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg flex items-center justify-center gap-2 hover:border-orange-400 hover:text-orange-500 transition-colors">
                    <Plus className="w-4 h-4" /> Add Set
                  </button>
                </div>
                {state.activeWorkout.exercises.length > 1 && (
                  <div className="px-4 pb-3">
                    <button onClick={() => removeExerciseFromWorkout(exIdx)} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
                      <Trash2 className="w-3 h-3" /> Remove Exercise
                    </button>
                  </div>
                )}
              </div>
            );
          })}
          <button 
            onClick={() => setExerciseModalState({ isOpen: true, mode: 'add_to_workout', selectedMuscle: 'chest', exerciseData: { name: '', equipment: 'barbell', primary: 'chest' }, targetExerciseIndex: null })} 
            className="w-full py-4 border-2 border-dashed border-gray-300 text-gray-600 rounded-xl flex items-center justify-center gap-2 hover:border-orange-500 hover:text-orange-500 transition-colors"
          >
            <Plus className="w-5 h-5" /> Add Exercise
          </button>
        </div>
        {allCompleted && (
          <div className="fixed bottom-20 left-0 right-0 p-4 bg-white border-t border-gray-200">
            <button onClick={() => setWorkoutFeedbackState(s => ({ ...s, showFeedback: true }))} className="w-full bg-green-500 text-white font-bold py-4 rounded-xl hover:bg-green-600 flex items-center justify-center gap-2">
              <Check className="w-5 h-5" /> Finish Workout
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderProgress = () => {
    const volumeByMuscle = {};
    Object.keys(MUSCLE_LABELS).forEach(m => { volumeByMuscle[m] = 0; });
    state.history.slice(-7).forEach(workout => {
      workout.exercises.forEach(ex => {
        if (volumeByMuscle[ex.muscle] !== undefined) volumeByMuscle[ex.muscle] += ex.sets.filter(s => s.completed).length;
      });
    });
    const exercisePRs = [];
    const exerciseDb = getExerciseDatabase();
    Object.entries(state.exerciseHistory).forEach(([exId, history]) => {
      const best = getBestPerformance(history);
      if (best) {
        let exName = exId;
        Object.values(exerciseDb).forEach(muscleExercises => {
          const found = muscleExercises.find(e => e.id === exId);
          if (found) exName = found.name;
        });
        exercisePRs.push({ id: exId, name: exName, ...best });
      }
    });
    exercisePRs.sort((a, b) => b.e1rm - a.e1rm);
    const overallVolumeData = getOverallVolumeData();
    return (
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-bold">Progress</h2>
        <ProgressionChart data={overallVolumeData} title="📊 Total Volume Over Time (kg × reps)" dataKey="volume" color="#f97316" />
        {exercisePRs.length > 0 && (
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <h4 className="font-semibold text-gray-700 mb-3">📈 Exercise Progression</h4>
            <select value={selectedExerciseForChart || ''} onChange={e => setSelectedExerciseForChart(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl mb-4">
              <option value="">Select an exercise...</option>
              {exercisePRs.map(ex => (<option key={ex.id} value={ex.id}>{ex.name}</option>))}
            </select>
            {selectedExerciseForChart && (
              <div className="space-y-4">
                <ProgressionChart data={getProgressionData(selectedExerciseForChart)} title="Estimated 1RM Progression" dataKey="e1rm" color="#10b981" />
                <ProgressionChart data={getProgressionData(selectedExerciseForChart)} title="Weight Progression" dataKey="weight" color="#3b82f6" />
              </div>
            )}
          </div>
        )}
        {exercisePRs.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">🏆 Personal Records</h3>
            <div className="space-y-2">
              {exercisePRs.slice(0, 5).map((pr, i) => (
                <div key={i} className="bg-white rounded-xl p-3 border border-gray-100 flex justify-between items-center">
                  <div><p className="font-semibold text-gray-900">{pr.name}</p><p className="text-sm text-gray-500">E1RM: {pr.e1rm}kg</p></div>
                  <div className="text-right"><p className="font-bold text-orange-600">{pr.weight}kg × {pr.reps}</p></div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div>
          <h3 className="font-semibold text-gray-700 mb-3">Weekly Volume (Last 7 Sessions)</h3>
          <div className="space-y-3">
            {Object.entries(MUSCLE_LABELS).map(([key, label]) => {
              const volume = volumeByMuscle[key];
              const landmark = VOLUME_LANDMARKS[key];
              const percentage = Math.min(100, (volume / landmark.mrv) * 100);
              return (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1"><span className="font-medium">{label}</span><span className="text-gray-500">{volume} / {landmark.mrv} sets</span></div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${volume >= landmark.mrv ? 'bg-red-500' : volume >= landmark.mav ? 'bg-green-500' : volume >= landmark.mev ? 'bg-yellow-500' : 'bg-gray-400'}`} style={{ width: `${percentage}%` }} />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-0.5"><span>MEV: {landmark.mev}</span><span>MAV: {landmark.mav}</span><span>MRV: {landmark.mrv}</span></div>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-gray-700 mb-3">Recent Workouts</h3>
          {state.history.length === 0 ? <p className="text-gray-500 text-center py-8">No workouts completed yet</p> : (
            <div className="space-y-2">
              {state.history.slice(-10).reverse().map((workout, i) => {
                const formatDur = (s) => s ? `${Math.floor(s/60)}m` : '';
                return (
                  <div key={i} className="bg-white rounded-xl p-4 border border-gray-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-gray-900">{workout.name}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(workout.startTime).toLocaleDateString()} • {workout.exercises.reduce((acc, ex) => acc + ex.sets.filter(s => s.completed).length, 0)} sets
                          {workout.durationSeconds && <span className="ml-1">• {formatDur(workout.durationSeconds)}</span>}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {workout.durationSeconds && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded flex items-center gap-1"><Clock className="w-3 h-3" />{formatDur(workout.durationSeconds)}</span>}
                        {workout.feedback && <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">Pump: {workout.feedback.pump}/5</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSettings = () => {
    const totalExercises = Object.values(DEFAULT_EXERCISES).reduce((sum, arr) => sum + arr.length, 0);
    const exportData = () => {
      const dataStr = JSON.stringify(state, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hypertrophy-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };
    const importData = (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          if (imported && typeof imported === 'object' && validateImportData(imported)) {
            showConfirm(
              'Import Data',
              'This will replace all your current data. Continue?',
              () => {
                setState({ ...createInitialState(), ...imported });
                showToast('Data imported successfully!', 'success');
              },
              { confirmLabel: 'Import', variant: 'warning' }
            );
          } else {
            showToast('Invalid backup file format.', 'error');
          }
        } catch (err) {
          showToast('Invalid backup file. Please select a valid JSON backup.', 'error');
        }
      };
      reader.readAsText(file);
      event.target.value = '';
    };
    const shareData = async () => {
      const dataStr = JSON.stringify(state);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const file = new File([blob], `hypertrophy-backup-${new Date().toISOString().split('T')[0]}.json`, { type: 'application/json' });
      if (navigator.share && navigator.canShare({ files: [file] })) {
        try { await navigator.share({ files: [file], title: 'Hypertrophy Pro Backup', text: 'My workout data backup' }); } catch (err) { if (err.name !== 'AbortError') { exportData(); } }
      } else { exportData(); }
    };
    const copyToClipboard = async () => {
      const dataStr = JSON.stringify(state);
      try { await navigator.clipboard.writeText(dataStr); showToast('Data copied to clipboard!', 'success'); } catch (err) { showToast('Failed to copy. Try using Export instead.', 'error'); }
    };
    return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Settings</h2>
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-3 mb-3"><Cloud className="w-6 h-6" /><h3 className="font-bold text-lg">Backup & Sync</h3></div>
        <p className="text-blue-100 text-sm mb-4">Export your data and save it to Google Drive, Dropbox, or anywhere else. Import it on any device.</p>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <button onClick={exportData} className="bg-white/20 hover:bg-white/30 py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"><Download className="w-4 h-4" /> Export</button>
          <button onClick={() => fileInputRef.current?.click()} className="bg-white/20 hover:bg-white/30 py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"><Upload className="w-4 h-4" /> Import</button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={shareData} className="bg-white text-blue-600 py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors"><Share2 className="w-4 h-4" /> Share</button>
          <button onClick={copyToClipboard} className="bg-white/20 hover:bg-white/30 py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"><Copy className="w-4 h-4" /> Copy</button>
        </div>
        <input ref={fileInputRef} type="file" accept=".json" onChange={importData} className="hidden" />
        <p className="text-blue-200 text-xs mt-3">💡 Tip: Save the exported file to Google Drive or iCloud for automatic sync across devices</p>
      </div>
      <div className="space-y-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Default Rest Timer (seconds)</label>
          <div className="flex items-center gap-4">
            <button onClick={() => setState(p => ({ ...p, settings: { ...p.settings, restTimer: Math.max(30, p.settings.restTimer - 30) } }))} className="p-2 bg-gray-100 rounded-lg"><Minus className="w-4 h-4" /></button>
            <span className="text-2xl font-bold w-20 text-center">{state.settings.restTimer}</span>
            <button onClick={() => setState(p => ({ ...p, settings: { ...p.settings, restTimer: Math.min(300, p.settings.restTimer + 30) } }))} className="p-2 bg-gray-100 rounded-lg"><Plus className="w-4 h-4" /></button>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Weight Increment (kg)</label>
          <div className="flex items-center gap-4">
            <button onClick={() => setState(p => ({ ...p, settings: { ...p.settings, weightIncrement: Math.max(0.5, (p.settings.weightIncrement || 2.5) - 0.5) } }))} className="p-2 bg-gray-100 rounded-lg"><Minus className="w-4 h-4" /></button>
            <span className="text-2xl font-bold w-20 text-center">{state.settings.weightIncrement || 2.5}</span>
            <button onClick={() => setState(p => ({ ...p, settings: { ...p.settings, weightIncrement: Math.min(10, (p.settings.weightIncrement || 2.5) + 0.5) } }))} className="p-2 bg-gray-100 rounded-lg"><Plus className="w-4 h-4" /></button>
          </div>
        </div>
        <button onClick={() => setExerciseModalState({ isOpen: true, mode: 'view', selectedMuscle: 'chest', exerciseData: { name: '', equipment: 'barbell', primary: 'chest' }, targetExerciseIndex: null })} className="w-full bg-white rounded-xl p-4 border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3"><Dumbbell className="w-5 h-5 text-purple-600" /><span className="font-semibold">Manage Custom Exercises</span></div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
        <button onClick={() => setTemplateModalState({ isOpen: true, mode: 'view', selectedTemplate: null, editingTemplate: null, newTemplateName: '' })} className="w-full bg-white rounded-xl p-4 border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3"><Copy className="w-5 h-5 text-blue-600" /><span className="font-semibold">Manage Custom Templates</span></div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
        <button onClick={() => showConfirm('Reset All Data', 'This will permanently delete all your workout history, exercises, and settings. This cannot be undone.', () => { setState(createInitialState()); setCurrentView('home'); showToast('All data has been reset.', 'info'); }, { confirmLabel: 'Reset Everything', variant: 'danger' })} className="w-full bg-red-50 text-red-600 font-semibold py-3 rounded-xl border border-red-200 flex items-center justify-center gap-2">
          <RotateCcw className="w-4 h-4" /> Reset All Data
        </button>
      </div>
      <div className="bg-gray-50 rounded-xl p-4">
        <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2"><Info className="w-4 h-4" /> Your Data</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-white rounded-lg p-3"><p className="text-gray-500">Workouts</p><p className="text-xl font-bold text-gray-900">{state.history.length}</p></div>
          <div className="bg-white rounded-lg p-3"><p className="text-gray-500">Exercises Tracked</p><p className="text-xl font-bold text-gray-900">{Object.keys(state.exerciseHistory).length}</p></div>
          <div className="bg-white rounded-lg p-3"><p className="text-gray-500">Exercise Library</p><p className="text-xl font-bold text-gray-900">{totalExercises}+</p></div>
          <div className="bg-white rounded-lg p-3"><p className="text-gray-500">Muscle Groups</p><p className="text-xl font-bold text-gray-900">{Object.keys(MUSCLE_LABELS).length}</p></div>
        </div>
      </div>
    </div>
  );};

  const renderContent = () => {
    switch (currentView) {
      case 'home': return renderHome();
      case 'new_meso': return renderNewMeso();
      case 'workout': return renderWorkout();
      case 'active_workout': return renderActiveWorkout();
      case 'progress': return renderProgress();
      case 'settings': return renderSettings();
      default: return renderHome();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pb-20">{renderContent()}</div>
      {renderExerciseModal()}
      {renderTemplateModal()}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      <ConfirmModal
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        confirmLabel={confirmState.confirmLabel}
        variant={confirmState.variant}
        onConfirm={confirmState.onConfirm}
        onCancel={() => setConfirmState(s => ({ ...s, isOpen: false }))}
      />
      {currentView !== 'active_workout' && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
          <div className="flex justify-around">
            {[
              { id: 'home', icon: Home, label: 'Home' },
              { id: 'workout', icon: Dumbbell, label: 'Workout' },
              { id: 'progress', icon: BarChart3, label: 'Progress' },
              { id: 'settings', icon: Settings, label: 'Settings' },
            ].map(item => (
              <button key={item.id} onClick={() => setCurrentView(item.id)} className={`flex flex-col items-center py-2 px-4 rounded-lg ${currentView === item.id ? 'text-orange-500' : 'text-gray-400 hover:text-gray-600'}`}>
                <item.icon className="w-6 h-6" /><span className="text-xs mt-1 font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
