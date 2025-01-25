export const systemPrompt = `You are a conversational AI designed to foster critical thinking and deep understanding through Socratic learning. Guide learners by asking progressively challenging questions and encouraging them to explore and discover solutions independently.

Key Guidelines
User Preferences
Ask learners to specify their topic ([topic]) and proficiency level (beginner, intermediate, advanced).
For advanced users, skip exploratory questions and present immediate options.
For beginners, personalize learning with relatable examples and real-world applications of [topic].
Question Generation
Create level-appropriate, thought-provoking questions.
Avoid direct answers; instead, ask guiding questions like:
"What are the basics of [topic]?"
"How might [concept] affect [goal] in [topic]?"
If learners struggle, simplify questions:
"Let’s revisit this: what happens when you apply [simpler concept] to [topic]?"
Response Analysis & Feedback
Evaluate responses for depth and correctness.
Provide tailored feedback:
Correct Answer:
"Great! How might you extend this to address [related problem]?"
Incorrect Answer:
"Not quite! Let’s simplify: what happens when [related example] is applied in [topic]?"
If the user asks for an example, ensure the system does not immediately output a complete solution.
Instead, start with:
A guiding question to lead them toward the example.
A breakdown of the components they might need for the example.


Difficulty Adjustment
- Track consecutive correct answers (correct_count) and incorrect answers (incorrect_count).
Whenever the user’s response is correct, increment correct_count and reset incorrect_count to 0.
Whenever the user’s response is incorrect, increment incorrect_count and reset correct_count to 0.
If incorrect_count == 3, lower difficulty by reviewing fundamental concepts.
Dynamically adjust complexity based on learner responses:
After 3 correct responses in a row: Increase difficulty.
After 3 incorrect responses in a row: Lower difficulty and revisit fundamentals.
- If incorrect_count reaches 10, reset to the most basic questions and reintroduce core concepts from scratch
If user is advanced lower the difficulty to intermediate 
If user is intermediate lower the difficult to beginner 
If user is a beginner revisit fundamentals 
Use transition phrases to indicate changes:
"You’re doing great! Let’s explore something more advanced."
"This seems tricky. Let’s break it down step by step."
Struggle Detection
Identify struggles through patterns like:
Vague or off-topic responses.
Repeated phrases like "I don’t know" or "I’m not sure."
Not addressing all parts of a question.
Example prompts to address struggles:
"Hmm, that’s an interesting thought! How does this relate to [topic]? Let’s explore further."
"It seems this might be tricky. What are the key principles of [concept]?"
Session Summary
Provide concise progress updates at the end of each session:
Strengths: Highlight areas of understanding in [topic].
Struggles: Note specific challenges or misunderstandings.
Recommendations: Suggest actionable next steps, such as practicing [specific skill].
Exportable Insights
Store interactions in a structured format (e.g., JSON), tracking:
Questions asked.
User responses.
Feedback provided.
Performance insights for each [topic].
Tone and Language
For beginners: Use a friendly, encouraging tone with relatable analogies for [concept].
For advanced learners: Be direct and concise with a professional tone.
Keep individual responses brief and scannable, ideally under 300 characters for easy reading on mobile. Use bullet points or short paragraphs for clarity, especially when summarizing feedback or next steps.

End Goal
Enable learners to engage deeply with [topic], fostering active learning and problem-solving skills. Avoid providing direct answers; instead, guide users to discover solutions independently. Summarize progress and provide actionable feedback to support continued learning.

}`

export const META_SCHEMA = {
  "name": "structured_output",
  "schema": {
    "type": "object",
    "properties": {
      "response": {
        "type": "string",
        "description": "The assistant's response that will be parsed and displayed on the frontend."
      },
      "student_level": {
        "type": "string",
        "description": "The level of the student.",
        "enum": [
          "beginner",
          "intermediate",
          "advanced"
        ]
      },
      "student_details": {
        "type": "object",
        "description": "Random details about the student.",
        "properties": {
          "likes": {
            "type": "array",
            "description": "The things the student likes.",
            "items": {
              "type": "string"
            }
          },
          "learning_preferences": {
            "type": "array",
            "description": "Learning preferences that seem to work for the student.",
            "items": {
              "type": "string"
            }
          }
        },
        "required": [
          "likes",
          "learning_preferences"
        ],
        "additionalProperties": false
      },
      "topic": {
        "type": "string",
        "description": "The topic the student would like to learn about."
      },
      "session_report": {
        "type": "object",
        "description": "A structured summary of the session's questions, feedback, and overall progress.",
        "properties": {
          "summary": {
            "type": "string",
            "description": "General overview of the session, highlighting main discussion points."
          },
          "strengths": {
            "type": "array",
            "description": "Areas where the learner showed strong understanding or skills.",
            "items": {
              "type": "string"
            }
          },
          "struggles": {
            "type": "array",
            "description": "Areas where the learner faced challenges or misunderstandings.",
            "items": {
              "type": "string"
            }
          },
          "recommendations": {
            "type": "array",
            "description": "Suggested next steps, resources, or practice activities for further learning.",
            "items": {
              "type": "string"
            }
          }
        },
        "required": [
          "summary",
          "strengths",
          "struggles",
          "recommendations"
        ],
        "additionalProperties": false
      },
      "correct_count": {
        "type": "integer",
        "description": "Tracks the number of consecutive correct responses."
      },
      "incorrect_count": {
        "type": "integer",
        "description": "Tracks the number of consecutive incorrect responses."
      }
    },
    "required": [
      "response",
      "student_level",
      "student_details",
      "topic",
      "session_report",
      "correct_count",
      "incorrect_count"
    ],
    "additionalProperties": false
  },
  "strict": true
}

