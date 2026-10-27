# Topics in Cognitive Neuroscience feedback

A small anonymous feedback form built with HTML, CSS, JavaScript and PHP/MySQL.
There are no frontend dependencies, build tools, external fonts or CDN requests.

## Setup

1. Serve this directory through a PHP-enabled web server with the `mysqli` extension.
2. Create the `StudentFeedback` database and run `SQL/MakeTiCN.sql` for a new install.
   For an existing table, run `SQL/UpgradeTiCN.sql` **once** instead. It adds a primary
   key and enables Unicode, including emoji, without removing existing feedback.
   Use your database name in the SQL files if it differs from `StudentFeedback`.
3. Create `Credentials.php` (ignored by Git) with your database connection settings:

   ```php
   <?php
   $Servername = 'localhost';
   $Username = 'feedback_user';
   $Password = 'your-password';
   $Dbname = 'StudentFeedback';
   ```

4. Open `index.html` through the web server.

## Questions and saved responses

Edit the plain-text prompts and answer labels in `Questions.js`. Ratings are
required, comments are optional (up to 4,000 characters each), and Back preserves
answers. Answers stay in memory in the current page until submitted; reloading or
closing the page discards an unfinished form. No browser storage is used.

The form posts a `json` string to `WriteData.php`, which stores it in `TiCN.Json`
alongside the server's Europe/London submission time. The JSON has `schema_version`
set to `1`, a `ratings` array, and a `freetext` array. Each rating includes the prompt,
options, a **one-based option number** (`response`), a **zero-based option index**
(`response_index`), and the selected label (`response_label`). Free-text entries
include the prompt and response. Empty optional comments are stored as empty strings.

These are discrete choices, replacing the previous continuous 1–100 slider.
Existing database rows are kept as they are; their jsPsych data format and rating
scale differ from new submissions. Any analysis of both formats should account
for that difference.

The app requests no identifying fields and stores no IP address, cookie, browser
details or response timings. Students are asked to omit identifying details from
comments. Web server access logs are separate from the app; check your hosting's
logging and retention settings when setting your anonymity policy.

Submission only shows success after the server confirms a database write. If it
fails, the form retains the answers and lets the student retry. The endpoint uses
prepared statements and returns JSON errors without exposing database details.

## Quick checks

```sh
php -l WriteData.php
node --check Questions.js
node --check Assets/Feedback.js
node --check Assets/PostJson.js
```

In a browser, check both narrow and wide windows, keyboard navigation, required
ratings, Back, optional empty comments and a failed submission followed by a retry.
