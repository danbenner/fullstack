// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('CySelectOption', ({ label, option }) => {
    cy.getByLabelText(label)
      .siblings('[role=button]')
      .click()
      .getByText(option)
      .click()
});

Cypress.Commands.add('CyStateProductPlan', ({ state, product, plan }) => {
    cy.visit('http://localhost:8081')
      .CySelectOption({ label: "State", option: state })
      .CySelectOption({ label: "Product", option: product })
      .CySelectOption({ label: "Plan", option: plan })
});

Cypress.Commands.add('CyEnterMemberID', ({ id }) => {
    cy.getByLabelText(/member amisys number/i)
      .type(id)
});

Cypress.Commands.add('CyClickNext', () => {
    cy.get('[data-test=next-button]')
      .click()
});

Cypress.Commands.add('CyCancelSubmit', () => {
    cy.get('[data-test=cancel-button]')
      .click()
});

Cypress.Commands.add('CyFinalSubmit', () => {
    cy.get('[data-test=final-submit-button]')
      .click()
});

Cypress.Commands.add('CyFullManualReward', ({
    url, state, product, plan, memberID, reward
}) => {
    cy.visit(url)
      .CyStateProductPlan({
        state: state,
        product: product,
        plan: plan
      })
      .CyEnterMemberID({ id: memberID })
      .wait(1000)
      .CySelectOption({ label: "Reward", option: reward })
      .CyClickNext()
      .CyFinalSubmit()
      .wait(2000)
});
