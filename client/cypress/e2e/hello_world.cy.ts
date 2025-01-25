describe('Input Text Test', () => {
    it('finds the input, types text, and presses Enter', () => {
      // Visit the app
      cy.visit('http://localhost:5173'); // Update with the correct URL if needed
  
      // Find the input using the data-cy attribute
      cy.get('[data-cy="input-text"]')
        .should('be.visible') // Ensure the input is visible
        .type('Hello Cypress!{enter}'); // Type text and press Enter
  
      // Optionally, assert something happens (e.g., alert)
      cy.on('window:alert', (text) => {
        expect(text).to.equal('You typed: Hello Cypress!');
      });
    });
  });
  