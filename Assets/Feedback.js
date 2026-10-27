(() => {
  'use strict';

  const welcome = document.getElementById('welcome');
  const form = document.getElementById('evaluation');
  const questionContainer = document.getElementById('questions');
  const begin = document.getElementById('begin');
  const back = document.getElementById('back');
  const next = document.getElementById('next');
  const progress = document.getElementById('progress');
  const status = document.getElementById('save-status');
  const error = document.getElementById('save-error');
  const panels = [];
  let step = 0;
  let submitting = false;

  // Build the questions once so going back never discards an answer.
  RatingQuestions.forEach((question, index) => {
    const panel = document.createElement('fieldset');
    const legend = document.createElement('legend');
    const heading = document.createElement('h2');
    heading.className = 'question-heading';
    heading.tabIndex = -1;
    heading.textContent = question.Prompt;
    legend.append(heading);
    panel.append(legend);

    const hint = document.createElement('p');
    hint.className = 'question-hint';
    hint.id = `hint-${index}`;
    hint.textContent = 'Choose the answer that best reflects your experience.';
    panel.setAttribute('aria-describedby', hint.id);
    panel.append(hint);

    const choices = document.createElement('div');
    choices.className = 'choices';
    choices.style.setProperty('--option-count', question.RespOpts.length);
    question.RespOpts.forEach((option, optionIndex) => {
      const label = document.createElement('label');
      label.className = 'choice';
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = `rating_${index}`;
      input.value = optionIndex;
      input.required = true;
      const text = document.createElement('span');
      text.textContent = option;
      label.append(input, text);
      choices.append(label);
    });
    panel.append(choices);
    panels.push(panel);
  });

  if (FreetextQuestions.length > 0) {
    const comments = document.createElement('section');
    const heading = document.createElement('h2');
    heading.className = 'question-heading';
    heading.tabIndex = -1;
    heading.textContent = 'A few final thoughts';
    comments.append(heading);
    const hint = document.createElement('p');
    hint.className = 'question-hint';
    hint.textContent = 'These comments are optional. Please leave out names and identifying details.';
    comments.append(hint);

    FreetextQuestions.forEach((prompt, index) => {
      const group = document.createElement('div');
      group.className = 'comment';
      const label = document.createElement('label');
      label.htmlFor = `freetext_${index}`;
      label.textContent = prompt;
      const optional = document.createElement('span');
      optional.className = 'optional';
      optional.textContent = ' (optional)';
      label.append(optional);
      const textarea = document.createElement('textarea');
      textarea.id = label.htmlFor;
      textarea.name = label.htmlFor;
      textarea.rows = 4;
      textarea.maxLength = 4000;
      const limit = document.createElement('p');
      limit.id = `limit-${index}`;
      limit.className = 'comment-limit';
      limit.textContent = 'Up to 4,000 characters.';
      textarea.setAttribute('aria-describedby', limit.id);
      group.append(label, textarea, limit);
      comments.append(group);
    });

    const note = document.createElement('p');
    note.className = 'submit-note';
    note.textContent = 'Your answers will be sent when you select Submit feedback.';
    comments.append(note);
    panels.push(comments);
  }

  panels.forEach(panel => {
    panel.hidden = true;
    questionContainer.append(panel);
  });
  progress.max = panels.length;

  function showStep() {
    welcome.hidden = true;
    form.hidden = false;
    error.hidden = true;
    panels.forEach((panel, index) => {
      panel.hidden = index !== step;
      // Hidden required inputs must not block validation of the current step.
      panel.querySelectorAll('input, textarea').forEach(input => { input.disabled = index !== step; });
    });
    const isRating = step < RatingQuestions.length;
    document.getElementById('step-label').textContent = isRating ? 'Your experience' : 'In your own words';
    document.getElementById('step-count').textContent = `Step ${step + 1} of ${panels.length}`;
    progress.value = step + 1;
    progress.setAttribute('aria-valuetext', `Step ${step + 1} of ${panels.length}`);
    next.textContent = step === panels.length - 1 ? 'Submit feedback' : 'Continue →';
    panels[step].querySelector('.question-heading').focus();
  }

  begin.addEventListener('click', showStep);
  back.addEventListener('click', () => {
    if (submitting) return;
    if (step > 0) {
      step--;
      showStep();
    } else {
      form.hidden = true;
      welcome.hidden = false;
      begin.focus();
    }
  });

  function collectAnswers() {
    return {
      schema_version: 1,
      ratings: RatingQuestions.map((question, index) => {
        const responseIndex = Number(panels[index].querySelector('input:checked').value);
        return {
          question_index: index,
          prompt: question.Prompt,
          options: question.RespOpts,
          response: responseIndex + 1,
          response_index: responseIndex,
          response_label: question.RespOpts[responseIndex]
        };
      }),
      freetext: FreetextQuestions.map((prompt, index) => ({
        question_index: index,
        prompt,
        response: document.getElementById(`freetext_${index}`).value.trim()
      }))
    };
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submitting || !form.reportValidity()) return;
    if (step < panels.length - 1) {
      step++;
      showStep();
      return;
    }

    const payload = { json: JSON.stringify(collectAnswers()) };
    submitting = true;
    back.disabled = next.disabled = true;
    panels[step].querySelectorAll('input, textarea').forEach(input => { input.disabled = true; });
    form.setAttribute('aria-busy', 'true');
    next.textContent = 'Submitting…';
    status.textContent = 'Saving your feedback…';
    error.hidden = true;

    try {
      await PostJson('./WriteData.php', payload);
      form.hidden = true;
      document.getElementById('success').hidden = false;
      document.getElementById('success-heading').focus();
    } catch {
      error.textContent = 'We couldn’t confirm that your feedback was saved. Your answers are still here. Check your connection and select Submit feedback to try again.';
      error.hidden = false;
    } finally {
      submitting = false;
      form.removeAttribute('aria-busy');
      status.textContent = '';
      back.disabled = next.disabled = false;
      panels[step].querySelectorAll('input, textarea').forEach(input => { input.disabled = false; });
      next.textContent = 'Submit feedback';
      if (!error.hidden) next.focus();
    }
  });

  document.getElementById('loading').hidden = true;
  begin.hidden = false;
})();
