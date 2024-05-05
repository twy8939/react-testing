describe("template spec", () => {
  it("passes", () => {
    cy.visit("/");

    cy.get("[data-cy=deliveryBtn]").should("be.visible").as("deliveryBtn");
    cy.get("[data-cy=pickupBtn]").should("be.visible").as("pickupBtn");

    cy.get("@deliveryBtn").click();
    cy.url().should("include", "/food-type");
  });

  it("사용자는 음식 종류를 선택할 수 있다.", () => {
    cy.visit("/food-type");

    cy.intercept(
      {
        method: "GET",
        url: "/restaurant/food-type",
      },
      {
        fixture: "food-type-list.json",
      }
    );

    cy.get("[data-cy=1]").should("be.visible").as("pizzaBtn");
    cy.get("@pizzaBtn").click();

    cy.url().should("include", "/food-type/1");
  });

  it("사용자는 원하는 레스토랑을 선택할 수 있다.", () => {
    cy.visit("/food-type/1");
    cy.intercept(
      {
        method: "GET",
        url: "/restaurant/food-type/1",
      },
      {
        fixture: "restaurant-list.json",
      }
    );

    cy.fixture("restaurant-list.json").then((restaurantList) => {
      cy.get(`[data-cy=${restaurantList[0].id}]`)
        .should("be.visible")
        .as("restaurantBtn");
      cy.get("@restaurantBtn").click();

      cy.url().should("include", "/restaurant/1");
    });
  });

  it("사용자는 원하는 메뉴를 장바구니에 담고, 원하는 음식 갯수를 변경할 수 있다.", () => {
    cy.visit("/restaurant/1");
    cy.fixture("menu.json").then((menu) => {
      cy.get(`[data-cy=${menu.menu_set[0].id}]`)
        .should("be.visible")
        .as("foodBtn");

      cy.get("@foodBtn").click();

      cy.url().should("include", "/order");
      cy.get(`[data-cy=counter]`).as("couetr");
      cy.get("@couetr").should("contain", 1);

      cy.get(`[data-cy=incrementBtn]`).should("be.visible").as("incrementBtn");
      cy.get("@incrementBtn").click();

      cy.get("@couetr").should("contain", 2);

      cy.get(`[data-cy=decrementBtn]`).should("be.visible").as("decrementBtn");
      cy.get("@decrementBtn").click();

      cy.get("@couetr").should("contain", 1);

      cy.get(`[data-cy=completeBtn]`).should("be.visible").click();

      cy.location("pathname").should("eq", "/");
    });
  });
});
