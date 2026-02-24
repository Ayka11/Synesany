import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://ireseyvvlchqzsonysrj.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjU5ZDJiNmE0LTFlOTctNDBhYS1iNzViLTg1ZmE1OGFlZTA4ZiJ9.eyJwcm9qZWN0SWQiOiJpcmVzZXl2dmxjaHF6c29ueXNyaiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzcxODU3NDIwLCJleHAiOjIwODcyMTc0MjAsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.fk0ZCM_AhqUqDbJWOIn0sBEYEu1dMTmGo1aCWC2inAs';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };