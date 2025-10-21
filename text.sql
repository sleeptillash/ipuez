-- use this file to construct your database on supabase

-- subjectsinsertion

-- Fix the sequence and insert new rows
WITH seq_fix AS (
  SELECT setval('subjects_id_seq', (SELECT MAX(id) FROM subjects) + 1, false)

)
INSERT INTO subjects (branch_id, semester_id, name, syllabus_details, notes) VALUES
('{1}', '3'   ,   'Computational Methods  ', '{}'  , 'notes_urlgoeshere'),
('{1}', '3'   ,  'Indian Knowledge System ', '{}'  , 'notes_urlgoeshere'),
('{1}', '3'   ,  'Discrete Mathematics ', '{}'  , 'notes_urlgoeshere'),
('{1}', '3'   ,  'Digital Logic and Computer Design ', '{}'  , 'notes_urlgoeshere'),
('{1}', '3'   ,  'Data Structures ', '{}'  , 'notes_urlgoeshere'),
('{1}', '3'   ,  ' Linear Algebra and Calculus', '{}'  , 'notes_urlgoeshere');




-- branch inserstion
WITH seq_fix AS (
  SELECT setval('branches_id_seq', (SELECT MAX(id) FROM branches) + 1, false)

)
INSERT INTO branches ( name) VALUES
(  'CSE'  ),
(  'AIML'  ),
(  'AIDS'  ),
(  'IT'  );




INSERT INTO subjects (branch_id, semester_id, name, syllabus_details, notes) VALUES
('{1,2,3,4,5,6,7}', '2'   ,   'Applied Mathematics II ', '{}'  , 'notes goes here'),
('{1,2,3,4,5,6,7}', '2'   ,  'Applied Physics II ', '{}'  , 'notes_urlgoeshere]'),
('{1,2,3,4,5,6,7}', '2'   ,  'Communication skills', '{}'  , 'notes_urlgoeshere'),
('{1,2,3,4,5,6,7}', '2'   ,  'Engineering Mechanics', '{}'  , 'notes_urlgoeshere'),
('{1,2,3,4,5,6,7}', '2'   ,  'Electrical Science', '{}'  , 'notes_urlgoeshere'),
('{1,2,3,4,5,6,7}', '2'   ,  'Environmental Science', '{}'  , 'notes_urlgoeshere'),
('{1,2,3,4,5,6,7}', '2'   ,  'Human Values And Ethics', '{}'  , 'notes_urlgoeshere'),
('{1,2,3,4,5,6,7}', '2'   ,  'Indian Constitution', '{}'  , 'notes_urlgoeshere'),
('{1,2,3,4,5,6,7}', '2'   ,  'Manufacturing Processes', '{}'  , 'notes_urlgoeshere'),
('{1,2,3,4,5,6,7}', '2'   ,  'Programming in C', '{}'  , 'notes_urlgoeshere'),
('{1,2,3,4,5,6,7}', '1'   ,  'Programming in C', '{}'  , 'notes_urlgoeshere'),
('{1,2,3,4,5,6,7}', '2'   ,  'Workshop Practice', '{}'  , 'notes_urlgoeshere'),









