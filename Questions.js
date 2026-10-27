// Labels are plain text. Each option is one discrete, ordered rating choice.
const RatingQuestions = [
  {
    Prompt: 'Overall, how satisfied are you with the module so far?',
    RespOpts: [
      'Extremely dissatisfied',
      'Somewhat dissatisfied',
      'Neither satisfied nor dissatisfied',
      'Somewhat satisfied',
      'Extremely satisfied'
    ]
  },
  {
    Prompt: 'How interesting have you found the workshops so far?',
    RespOpts: [
      'Extremely boring',
      'Somewhat boring',
      'Neither boring nor interesting',
      'Somewhat interesting',
      'Extremely interesting'
    ]
  },
  {
    Prompt: 'Overall, how informative are you finding the module?',
    RespOpts: [
      'I have learnt almost nothing new',
      'I have learnt a fair bit',
      'I have learnt many new things'
    ]
  },
  {
    Prompt: 'Consider what you have learnt from this module so far. How useful do you think this will be in the long term?',
    RespOpts: [
      'Completely useless',
      'Somewhat useless',
      'Maybe useful',
      'Somewhat useful',
      'Extremely useful'
    ]
  },
  {
    Prompt: 'To what extent do you agree or disagree with this statement? “The module content has helped me understand a variety of topics in cognitive neuroscience.”',
    RespOpts: [
      'Strongly disagree',
      'Somewhat disagree',
      'Neither agree nor disagree',
      'Somewhat agree',
      'Strongly agree'
    ]
  },
  {
    Prompt: 'To what extent do you agree or disagree with this statement? “The lecturers have supported my learning throughout this module.”',
    RespOpts: [
      'Strongly disagree',
      'Somewhat disagree',
      'Neither agree nor disagree',
      'Somewhat agree',
      'Strongly agree'
    ]
  },
  {
    Prompt: 'To what extent do you agree or disagree with this statement? “I found the Canvas site for this module clear and easy to use.”',
    RespOpts: [
      'Strongly disagree',
      'Somewhat disagree',
      'Neither agree nor disagree',
      'Somewhat agree',
      'Strongly agree'
    ]
  }
];

const FreetextQuestions = [
  'What do you like about this module?',
  'What about this module do you think could be improved?'
];
