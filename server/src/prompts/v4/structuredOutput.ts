const structuredOutput = {
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
  

export default structuredOutput