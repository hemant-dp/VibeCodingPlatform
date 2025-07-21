-- Insert admin user if not exists
INSERT INTO users (username, email, password_hash, role)
SELECT 'admin', 'admin@cognizant.com', '$2a$10$KHR.CfkJe1WBPrPYpMXXBeXyEzQGQJ9qY1XgBVk8bvZXvgq3dFTVi', 'ADMIN'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin');

-- Insert sample problems
INSERT INTO problems (title, description, constraints, difficulty, tags, input_format, output_format, created_by)
VALUES 
(
    'Two Sum',
    'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.',
    '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9\nOnly one valid answer exists.',
    'EASY',
    '["Array", "Hash Table"]',
    'First line contains n - the size of the array\nSecond line contains n space-separated integers\nThird line contains the target sum',
    'Two space-separated integers representing the indices',
    1
),
(
    'Maximum Subarray',
    'Given an integer array nums, find the subarray with the largest sum, and return its sum. A subarray is a contiguous non-empty sequence of elements within an array.',
    '-10^4 <= nums[i] <= 10^4\n1 <= nums.length <= 10^5',
    'MEDIUM',
    '["Array", "Dynamic Programming", "Divide and Conquer"]',
    'First line contains n - the length of array\nSecond line contains n space-separated integers',
    'A single integer representing the maximum subarray sum',
    1
),
(
    'Binary Tree Maximum Path Sum',
    'A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence at most once. Note that the path does not need to pass through the root. The path sum of a path is the sum of the node values in the path. Given the root of a binary tree, return the maximum path sum of any non-empty path.',
    'The number of nodes in the tree is in the range [1, 3 * 10^4]\n-1000 <= Node.val <= 1000',
    'HARD',
    '["Binary Tree", "DFS", "Dynamic Programming"]',
    'The input represents a binary tree in level order traversal\nFirst line contains the number of nodes\nSecond line contains space-separated integers or null',
    'A single integer representing the maximum path sum',
    1
);

-- Insert sample test cases
INSERT INTO test_cases (problem_id, input, expected_output, is_sample)
VALUES
-- Test cases for Two Sum
(1, '4\n2 7 11 15\n9', '0 1', true),
(1, '3\n3 2 4\n6', '1 2', true),
(1, '2\n3 3\n6', '0 1', false),

-- Test cases for Maximum Subarray
(2, '9\n-2 1 -3 4 -1 2 1 -5 4', '6', true),
(2, '1\n1', '1', true),
(2, '5\n5 4 -1 7 8', '23', false),

-- Test cases for Binary Tree Maximum Path Sum
(3, '5\n1 2 3 null null', '6', true),
(3, '5\n-10 9 20 null null 15 7', '42', true),
(3, '3\n2 -1 -2', '2', false);
(12, '0 1\n\n1', '1.0', false);

-- Insert sample submissions
INSERT INTO submissions (user_id, problem_id, code, language, status, execution_time_ms, memory_used_kb, submitted_at)
VALUES
(2, 1, 'class Solution { public int[] twoSum(int[] nums, int target) { } }', 'JAVA', 'ACCEPTED', 5, 1024, NOW()),
(2, 2, 'def maxSubArray(nums): pass', 'PYTHON', 'WRONG_ANSWER', 10, 2048, NOW() - INTERVAL 1 DAY),
(2, 3, 'public class Solution { }', 'JAVA', 'COMPILATION_ERROR', NULL, NULL, NOW() - INTERVAL 2 DAY),
(2, 1, 'function twoSum(nums, target) { }', 'JAVASCRIPT', 'RUNTIME_ERROR', 15, 3072, NOW() - INTERVAL 3 DAY),
(2, 2, 'int maxSubArray(vector<int>& nums) { }', 'CPP', 'TIME_LIMIT_EXCEEDED', 2000, 4096, NOW() - INTERVAL 4 DAY); 