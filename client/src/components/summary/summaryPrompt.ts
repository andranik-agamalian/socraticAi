export const summaryPrompt = `
Give me a summary summarizing all of this topics into bulletpoints 
{
"response": "🔥 Drop a one-liner summary that captures the session's essence!",
"student_level": "Choose one: beginner | intermediate | advanced",
"student_details": {
  "likes": ["🎨 Things the student loves—could be math, music, or marshmallows!"],
  "learning_preferences": ["📚 Preferred learning styles—think visuals, hands-on, or discussions!"],
  "learning_style": "Select one: Diverging | Assimilating | Accommodating | Converging"
},
"topic": "🧐 What exciting topic did we dive into today?",
"ai_role": "What role did I play? Choose one: Coaching Role | Facilitator Role | Expert Role | Evaluator Role",
"session_report": {
  "summary": "🌟 A quick overview of our journey today!",
  "strengths": ["💪 Where the learner absolutely crushed it!"],
  "struggles": ["🤔 Challenges the learner faced (and will conquer next time!)"],
  "recommendations": ["📈 Tailored tips, tricks, or resources to keep the momentum going!"]
},
"correct_count": "✔️ How many correct answers did the student get?",
"incorrect_count": "❌ How many tricky spots did the student stumble on?"
}
`;