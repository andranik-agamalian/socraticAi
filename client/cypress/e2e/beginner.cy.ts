describe('Initial tests setups!', () => {
  it('The tutor should ask if the user is beginner, intermediate, or advanced', () => {

    cy.visit('http://localhost:5173');

    cy.get('[data-cy="input-text"]')
      .should('be.visible')
      .type('Hi, I wanna learn about javascript !{enter}');

    // test the response of the chat
    cy.get('[data-cy="chatgpt-false"]')
      .first()
      .should('exist')
      .invoke('text')
      .then((text) => {
        expect(text).to.contain('beginner, intermediate');
      });

    // Find the input using the data-cy attribute
    cy.get('[data-cy="input-text"]')
      .should('be.visible')
      .type('i am a beginner and want to learn about variables {enter}');

    cy.get('[data-cy="chatgpt-false"]')
      .eq(1)
      .should('exist')
      .invoke('text')
      .then((text) => {
        expect(text.toLowerCase()).to.contain('you');
      });

    /**
     * test that the word think is not there the word 'what can you do' 
     * or something similar should be a respond instead  
    */

    // Find the input using the data-cy attribute
    cy.get('[data-cy="input-text"]')
      .should('be.visible')
      .type('I think variables are very useful and amazing. A variable is a way to assign a thing to it you need them to assign placeholdrs to things {enter}');

    cy.get('[data-cy="chatgpt-false"]')
      .eq(2)
      .should('exist')
      .invoke('text')
      .then((text) => {
        expect(text.toLowerCase()).to.contain('you');
      });
    /**
     * 
    */

    // Find the input using the data-cy attribute
    cy.get('[data-cy="input-text"]')
      .should('be.visible')
      .type('You can asssign booleans, strings, numbers, objects, functions, null using const or var or let and the difference is that let and var lets use reassigned to other values and const does not you can only assign it to one value {enter}');

    cy.get('[data-cy="chatgpt-false"]')
      .eq(3)
      .should('exist')
      .invoke('text')
      .then((text) => {
        expect(text.toLowerCase()).to.contain('you');
      });

    /**
     * It keeps asking what can let and const do even though I have already said that 
    */

    // Find the input using the data-cy attribute
    cy.get('[data-cy="input-text"]')
      .should('be.visible')
      .type('const prevents you to reassign to to a different value while let lets you reassign to other values like var  {enter}');

    cy.get('[data-cy="chatgpt-false"]')
      .eq(4)
      .should('exist')
      .invoke('text')
      .then((text) => {
        expect(text.toLowerCase()).to.contain('you');
      });

    /**
     * At this point it should moved on from variables and start increasing difficulty
     * Double check that difficulty has increased or is testing a more difficult subject   
    */

    // Find the input using the data-cy attribute
    cy.get('[data-cy="input-text"]')
      .should('be.visible')
      .type('variables can also introduced scope such as functions and this scopes prevents variables inside this scope to be access outside of the scope  {enter}');

    cy.get('[data-cy="chatgpt-false"]')
      .eq(4)
      .should('exist')
      .invoke('text')
      .then((text) => {
        expect(text.toLowerCase()).to.contain('you');
      });

    /**
     * At this point we should get a summary of what we have gone over 
    */

    // Find the input using the data-cy attribute
    cy.get('[data-cy="input-text"]')
      .should('be.visible')
      .type('Give me a summary of my strengths, interests, how many I had correct and incorrect  {enter}');

    cy.get('[data-cy="chatgpt-false"]')
      .eq(4)
      .should('exist')
      .invoke('text')
      .then((text) => {
        expect(text.toLowerCase()).to.contain('you');
      });


  });
});
