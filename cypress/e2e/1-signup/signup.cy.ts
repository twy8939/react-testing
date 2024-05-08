describe("회원가입 테스트", () => {
  it("사용자는 이메일과 비밀번호를 사용해서 회원가입한다.", () => {
    // given - 회원가입 페이지에 접근한다.
    cy.visit("/signup");
    cy.get("[data-cy=signupButton").as("signupButton");
    cy.get("@signupButton").should("be.visible");

    // when - 이메일과 비밀번호를 입력하고, 비밀번호와 비밀번호 확인값이  일치한다.
    cy.get("[data-cy=emailInput]").as("emailInput");
    cy.get("[data-cy=passwordInput]").as("passwordInput");
    cy.get("[data-cy=confirmPasswordInput]").as("confirmPasswordInput");

    cy.get("@emailInput").type("test@email.com");
    cy.get("@passwordInput").type("password");
    cy.get("@confirmPasswordInput").type("password");

    cy.get("@passwordInput")
      .invoke("val")
      .then((passwordValue) => {
        cy.get("@passwordInput").should("have.value", passwordValue);

        cy.get("@confirmPasswordInput")
          .invoke("val")
          .should("eq", passwordValue);

        cy.get("@signupButton").should("not.be.disabled");
      });

    // then - 회원가입 버튼이 활성화되며 회원가입이 완료되고 로그인 페이지로 이동한다.
    cy.intercept(
      {
        method: "POST",
        url: "/user/signup",
      },
      { msg: "success" }
    ).as("signup");
    cy.get("@signupButton").click();
    cy.url().should("include", "/login");
  });
});
