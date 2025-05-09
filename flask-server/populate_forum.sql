USE your_database;

INSERT INTO mood_entries (mood, rating, reason)
VALUES 
  ('Happy', 9, 'Had a great day at school!'),
  ('Sad', 3, 'Feeling lonely today.'),
  ('Excited', 10, 'Got accepted to a program!'),
  ('Neutral', 5, 'Just another day.');
  
  select * from mood_entries;


  
INSERT INTO admins (username, password)
VALUES ('admin', 'Password123');

-- Insert 20 discussions
INSERT INTO discussions (user, title, content, likes, created_at) VALUES ('User1', 'Post-surgery diet questions', 'This is a discussion on: Post-surgery diet questions', 0, '2025-03-29 17:06:07');
INSERT INTO discussions (user, title, content, likes, created_at) VALUES ('User2', 'Experiencing hair loss – is this normal?', 'This is a discussion on: Experiencing hair loss – is this normal?', 49, '2025-03-20 17:06:07');
INSERT INTO discussions (user, title, content, likes, created_at) VALUES ('User3', 'How to stay motivated after weight loss', 'This is a discussion on: How to stay motivated after weight loss', 33, '2025-02-28 17:06:07');
INSERT INTO discussions (user, title, content, likes, created_at) VALUES ('User4', 'Recommended vitamins post-op?', 'This is a discussion on: Recommended vitamins post-op?', 13, '2025-04-02 17:06:07');
INSERT INTO discussions (user, title, content, likes, created_at) VALUES ('User5', 'Dealing with social eating pressure', 'This is a discussion on: Dealing with social eating pressure', 36, '2025-04-14 17:06:07');
INSERT INTO discussions (user, title, content, likes, created_at) VALUES ('User6', 'Loose skin concerns', 'This is a discussion on: Loose skin concerns', 31, '2025-03-16 17:06:07');
INSERT INTO discussions (user, title, content, likes, created_at) VALUES ('User7', 'First month post-op reflections', 'This is a discussion on: First month post-op reflections', 14, '2025-03-14 17:06:07');
INSERT INTO discussions (user, title, content, likes, created_at) VALUES ('User8', 'Exercise tips after gastric bypass', 'This is a discussion on: Exercise tips after gastric bypass', 14, '2025-04-18 17:06:07');
INSERT INTO discussions (user, title, content, likes, created_at) VALUES ('User9', 'How to manage cravings', 'This is a discussion on: How to manage cravings', 2, '2025-04-08 17:06:07');
INSERT INTO discussions (user, title, content, likes, created_at) VALUES ('User10', 'Struggling with water intake', 'This is a discussion on: Struggling with water intake', 33, '2025-03-31 17:06:07');
INSERT INTO discussions (user, title, content, likes, created_at) VALUES ('User11', 'Tips for mental health post-surgery', 'This is a discussion on: Tips for mental health post-surgery', 1, '2025-02-25 17:06:07');
INSERT INTO discussions (user, title, content, likes, created_at) VALUES ('User12', 'Anyone else dealing with dumping syndrome?', 'This is a discussion on: Anyone else dealing with dumping syndrome?', 22, '2025-02-28 17:06:07');
INSERT INTO discussions (user, title, content, likes, created_at) VALUES ('User13', 'Protein intake ideas?', 'This is a discussion on: Protein intake ideas?', 2, '2025-03-17 17:06:07');
INSERT INTO discussions (user, title, content, likes, created_at) VALUES ('User14', 'Looking for a good support group', 'This is a discussion on: Looking for a good support group', 11, '2025-04-19 17:06:07');
INSERT INTO discussions (user, title, content, likes, created_at) VALUES ('User15', 'Update: 3 months progress!', 'This is a discussion on: Update: 3 months progress!', 41, '2025-04-16 17:06:07');
INSERT INTO discussions (user, title, content, likes, created_at) VALUES ('User16', 'Gastric sleeve vs bypass – my thoughts', 'This is a discussion on: Gastric sleeve vs bypass – my thoughts', 2, '2025-04-19 17:06:07');
INSERT INTO discussions (user, title, content, likes, created_at) VALUES ('User17', 'Biggest post-op challenges', 'This is a discussion on: Biggest post-op challenges', 6, '2025-04-21 17:06:07');
INSERT INTO discussions (user, title, content, likes, created_at) VALUES ('User18', 'Sleep quality changes?', 'This is a discussion on: Sleep quality changes?', 23, '2025-03-02 17:06:07');
INSERT INTO discussions (user, title, content, likes, created_at) VALUES ('User19', 'Sugar-free snacks recommendations', 'This is a discussion on: Sugar-free snacks recommendations', 42, '2025-03-13 17:06:07');
INSERT INTO discussions (user, title, content, likes, created_at) VALUES ('User20', 'Finding clothes after rapid weight loss', 'This is a discussion on: Finding clothes after rapid weight loss', 26, '2025-03-16 17:06:07');

-- Insert comments for each discussion
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (1, 'Commenter1', 'Ask your surgeon, but this was my experience...', 20, '2025-04-16 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (1, 'Commenter2', 'It gets better with time, keep going!', 17, '2025-04-16 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (1, 'Commenter3', 'It gets better with time, keep going!', 3, '2025-04-20 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (1, 'Commenter4', 'My dietitian recommended increasing protein shakes.', 16, '2025-03-28 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (2, 'Commenter5', 'Try chewing slower—it helped me a lot.', 18, '2025-04-17 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (2, 'Commenter6', 'I use a reminder app to stay on track.', 11, '2025-04-08 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (2, 'Commenter7', 'It gets better with time, keep going!', 16, '2025-04-12 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (2, 'Commenter8', 'My dietitian recommended increasing protein shakes.', 19, '2025-03-31 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (2, 'Commenter9', 'Try chewing slower—it helped me a lot.', 2, '2025-04-02 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (4, 'Commenter10', 'It gets better with time, keep going!', 13, '2025-04-19 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (4, 'Commenter11', 'It gets better with time, keep going!', 8, '2025-04-01 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (4, 'Commenter12', 'My dietitian recommended increasing protein shakes.', 3, '2025-04-11 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (4, 'Commenter13', 'Try chewing slower—it helped me a lot.', 11, '2025-04-19 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (5, 'Commenter14', 'It gets better with time, keep going!', 15, '2025-04-21 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (5, 'Commenter15', 'Try chewing slower—it helped me a lot.', 15, '2025-04-13 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (6, 'Commenter16', 'It gets better with time, keep going!', 19, '2025-04-18 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (6, 'Commenter17', 'I use a reminder app to stay on track.', 6, '2025-04-16 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (6, 'Commenter18', 'It gets better with time, keep going!', 17, '2025-03-26 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (6, 'Commenter19', 'I use a reminder app to stay on track.', 8, '2025-03-31 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (6, 'Commenter20', 'My dietitian recommended increasing protein shakes.', 16, '2025-04-14 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (7, 'Commenter21', 'Totally relate to this. You''re not alone.', 9, '2025-04-10 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (7, 'Commenter22', 'My dietitian recommended increasing protein shakes.', 7, '2025-04-03 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (8, 'Commenter23', 'I use a reminder app to stay on track.', 0, '2025-04-15 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (10, 'Commenter24', 'Totally relate to this. You''re not alone.', 15, '2025-04-06 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (10, 'Commenter25', 'Totally relate to this. You''re not alone.', 17, '2025-03-24 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (10, 'Commenter26', 'I use a reminder app to stay on track.', 0, '2025-03-23 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (11, 'Commenter27', 'It gets better with time, keep going!', 17, '2025-04-10 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (11, 'Commenter28', 'Ask your surgeon, but this was my experience...', 4, '2025-04-13 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (11, 'Commenter29', 'I use a reminder app to stay on track.', 12, '2025-03-31 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (11, 'Commenter30', 'It gets better with time, keep going!', 14, '2025-04-11 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (11, 'Commenter31', 'I use a reminder app to stay on track.', 7, '2025-04-01 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (12, 'Commenter32', 'Totally relate to this. You''re not alone.', 15, '2025-04-22 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (12, 'Commenter33', 'It gets better with time, keep going!', 10, '2025-03-27 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (12, 'Commenter34', 'Totally relate to this. You''re not alone.', 7, '2025-04-02 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (12, 'Commenter35', 'Totally relate to this. You''re not alone.', 10, '2025-04-16 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (14, 'Commenter36', 'Ask your surgeon, but this was my experience...', 13, '2025-04-08 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (14, 'Commenter37', 'Ask your surgeon, but this was my experience...', 5, '2025-04-02 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (14, 'Commenter38', 'I use a reminder app to stay on track.', 20, '2025-04-08 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (14, 'Commenter39', 'I use a reminder app to stay on track.', 17, '2025-04-19 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (14, 'Commenter40', 'Try chewing slower—it helped me a lot.', 2, '2025-04-09 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (15, 'Commenter41', 'Totally relate to this. You''re not alone.', 12, '2025-03-31 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (15, 'Commenter42', 'Totally relate to this. You''re not alone.', 20, '2025-04-22 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (15, 'Commenter43', 'I use a reminder app to stay on track.', 9, '2025-04-03 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (15, 'Commenter44', 'My dietitian recommended increasing protein shakes.', 3, '2025-04-05 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (15, 'Commenter45', 'I use a reminder app to stay on track.', 11, '2025-04-21 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (16, 'Commenter46', 'My dietitian recommended increasing protein shakes.', 4, '2025-04-20 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (17, 'Commenter47', 'It gets better with time, keep going!', 11, '2025-03-30 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (17, 'Commenter48', 'Try chewing slower—it helped me a lot.', 7, '2025-04-16 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (18, 'Commenter49', 'Totally relate to this. You''re not alone.', 2, '2025-04-03 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (18, 'Commenter50', 'Try chewing slower—it helped me a lot.', 11, '2025-04-21 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (18, 'Commenter51', 'Ask your surgeon, but this was my experience...', 19, '2025-03-30 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (18, 'Commenter52', 'My dietitian recommended increasing protein shakes.', 7, '2025-04-22 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (18, 'Commenter53', 'My dietitian recommended increasing protein shakes.', 14, '2025-04-05 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (19, 'Commenter54', 'Totally relate to this. You''re not alone.', 13, '2025-03-28 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (19, 'Commenter55', 'Try chewing slower—it helped me a lot.', 13, '2025-04-19 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (19, 'Commenter56', 'Try chewing slower—it helped me a lot.', 20, '2025-03-31 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (20, 'Commenter57', 'My dietitian recommended increasing protein shakes.', 2, '2025-03-29 17:06:07');
INSERT INTO comments (discussion_id, user, message, likes, created_at) VALUES (20, 'Commenter58', 'Totally relate to this. You''re not alone.', 12, '2025-03-28 17:06:07');