/// <reference types="cypress" />

describe('Listar todos los técnicos que llegan desde BD', () => {
  beforeEach(() => {
    cy.fixture('technicians.json').as('techniciansData').then((res) => {
      cy.intercept('**/technicians*', (req) => {
        req.reply(res)
      }).as('getTechnicians')
    })
    cy.visit('/list-technicians')
  })
  it('Comprobar que se listen todos los técnicos', () => {
    cy.wait('@getTechnicians', 3000)
    cy.get('@techniciansData').then((technicians) => {
      technicians.forEach((technician, index) => {
        cy.get(`[data-cy="technician-card"]:eq(${index})`).within(() => {
          cy.get('[data-cy="technician-name"]').should('contain.text', technician.name)
          cy.get('[data-cy="technician-id"]').should('contain.text', technician.id)
          cy.get('[data-cy="technician-date-born"]').should('contain.text', technician.date_born.substring(0, 10))
        })
      })
    })
  })
  it('Comprobar que se acceda a la página de edición de técnico correcta (id correcto)', () => {
    cy.wait('@getTechnicians', 3000)
    cy.intercept('GET', '**/technicians/*').as('editTechnician')
    cy.get('@techniciansData').then((technicians) => {
      cy.get('[data-cy="modify-button"]').first().click().then(() => {
        cy.wait('@editTechnician').then((interception) => {
          const { request } = interception
          expect(request.url).to.include(`/technicians/${technicians[0].id}`)
        })
      })
    })
  })
})