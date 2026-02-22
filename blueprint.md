
# **Blueprint: Lotto Number Generator**

## **Overview**

This is a simple, interactive web application that generates random lottery numbers. It provides a clean, user-friendly interface for users to get their lucky numbers with a single click.

## **Design and Features**

*   **Modern & Bold Aesthetics:** The app features a visually appealing design with a bold color scheme, custom fonts, and interactive elements.
*   **Responsive Layout:** The interface is fully responsive and adapts to different screen sizes, ensuring a seamless experience on both desktop and mobile devices.
*   **Interactive Number Generation:** Users can generate a new set of lottery numbers by clicking the "Generate Numbers" button. The numbers are displayed in visually distinct "lotto balls."
*   **Web Components:** The lotto balls are implemented as custom HTML elements (Web Components) for better encapsulation and reusability.
*   **CSS Effects:** The app utilizes modern CSS for styling, including custom properties (variables), drop shadows for a "lifted" feel, and a subtle glow effect on interactive elements.
*   **Accessibility:** The app is designed with accessibility in mind, ensuring it is usable by a wide range of users.

## **Current Plan**

*   **HTML Structure:**
    *   Set up the main `index.html` file with a title, a header, a container for the lotto numbers, and a "Generate" button.
*   **CSS Styling:**
    *   Create a `style.css` file to define the visual appearance of the application.
    *   Style the body, header, number container, individual lotto balls, and the button.
*   **JavaScript Logic:**
    *   Create a `main.js` file to handle the application's logic.
    *   Implement a function to generate 6 unique random numbers between 1 and 45.
    *   Create a custom element (`lotto-ball`) to display each number.
    *   Add an event listener to the "Generate" button to trigger the number generation and display.
