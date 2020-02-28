/// <reference types="Cypress" />

describe('e2e', function() {
  beforeEach(() => {
    cy.visit('http://localhost:8081')
  })
  it('Plan not found', function() {
    cy.CySelectOption({ label: 'State', option: 'Arkansas' })
      .CySelectOption({ label: 'Product', option: 'MEDICAID' })
      .getByText('Error: Not Found')
  });
  it('Plan not selected', function() {
    cy.CyStateProductPlan({
      state: 'Arizona',
      product: 'MEDICAID',
      plan: 'Arizona Complete Health'
    })
      .CySelectOption({ label: 'Product', option: 'MARKETPLACE' })
      .getByLabelText('Plan')
      .siblings('[role=button]')
      .should('contain', '')
  });
  it('Select All Options', function() {
      cy.CyStateProductPlan({
        state: "Arizona",
        product: "MEDICAID",
        plan: "Arizona Complete Health"
      })
  });
  it('Member Not Found', function() {
      cy.CyStateProductPlan({
        state: "Arizona",
        product: "MEDICAID",
        plan: "Arizona Complete Health"
      })
      .CyEnterMemberID({ id: "U1231231231" })
      .getByText('Member Not Found')
  });
  it('Eligible', function() {
      cy.CyStateProductPlan({
        state: "Ohio",
        product: "MEDICARE",
        plan: "MMP-OH-MyCare Ohio-H0022"
      })
      .CyEnterMemberID({ id: "C0003700501" })
      .getByText('Eligible')
  });
  it('Not Eligible', function() {
      cy.CyStateProductPlan({
        state: "Arkansas",
        product: "MARKETPLACE",
        plan: "Market Place - Arkansas"
      })
      .CyEnterMemberID({ id: "U9002758001" })
      .getByText('Not Eligible')
  });
  it('Select Reward', function() {
      cy.CyStateProductPlan({
        state: "Indiana",
        product: "MEDICAID",
        plan: "MHS-IN"
      })
      .CyEnterMemberID({ id: "00007347101" })
      .wait(1000)
      .CySelectOption({ label: "Reward", option: "Care Gap Level 2" })
  });
  it('Reset Plan and Reward', function() {
    cy.CyStateProductPlan({
      state: "Indiana",
      product: "MEDICAID",
      plan: "MHS-IN"
    })
    .CyEnterMemberID({ id: "00007347101" })
    .wait(1000)
    .CySelectOption({ label: "Reward", option: "Care Gap Level 2" })
    .CySelectOption({ label: 'State', option: 'Arizona' })
    .getByLabelText('Plan')
    .siblings('[role=button]')
    .should('contain', '')
    .getByLabelText('Reward')
    .should('be.hidden')
  });
  it('Review Reward', function() {
      cy.CyStateProductPlan({
        state: "Indiana",
        product: "MEDICAID",
        plan: "MHS-IN"
      })
      .CyEnterMemberID({ id: "00007347101" })
      .wait(1000)
      .CySelectOption({ label: "Reward", option: "Care Gap Level 2" })
      .CyClickNext()
  });
  it('Cancel Reward', function() {
      cy.CyStateProductPlan({
        state: "Indiana",
        product: "MEDICAID",
        plan: "MHS-IN"
      })
      .CyEnterMemberID({ id: "00007347101" })
      .wait(1000)
      .CySelectOption({ label: "Reward", option: "Care Gap Level 2" })
      .CyClickNext()
      .CyCancelSubmit()
  });
});

// describe('e2e', function() {
//   it('Submit Reward', function() {
//     cy.CyFullManualReward({
//       url: 'http://localhost:8081',
//       state: 'Indiana',
//       product: 'MEDICAID',
//       plan: 'MHS-IN',
//       memberID: '00007347101',
//       reward: 'Care Gap Level 2'
//     })
//   });
// });
