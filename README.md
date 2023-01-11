<div align="center">

  <img src="assets/logo.png" alt="logo" width="200" height="auto" />
  <h1>Smash the Motherboard</h1>
  
  <p>
    A creator economy platform for supporting creators
  </p>
</div>

<br />

<!-- Table of Contents -->

# :notebook_with_decorative_cover: Table of Contents

- [About the Project](#star2-about-the-project)
  - [Screenshots](#camera-screenshots)
  - [Tech Stack](#space_invader-tech-stack)
  - [Features](#dart-features)
  - [Color Reference](#art-color-reference)
  - [Environment Variables](#key-environment-variables)
- [Getting Started](#toolbox-getting-started)
  - [Prerequisites](#bangbang-prerequisites)
  - [Installation](#gear-installation)
  - [Running Tests](#test_tube-running-tests)
  - [Run Locally](#running-run-locally)
  - [Deployment](#triangular_flag_on_post-deployment)
- [Usage](#eyes-usage)
- [Roadmap](#compass-roadmap)
- [Contributing](#wave-contributing)
  - [Code of Conduct](#scroll-code-of-conduct)
- [FAQ](#grey_question-faq)
- [License](#warning-license)
- [Contact](#handshake-contact)
- [Acknowledgements](#gem-acknowledgements)

<!-- About the Project -->

## :star2: About the Project

<!-- Screenshots -->

### :camera: Screenshots

<div align="center"> 
  <img src="/stmb-collage.jpg" alt="screenshot" />
</div>

<!-- TechStack -->

### :space_invader: Tech Stack

<details>
  <summary>Client</summary>
  <ul>
    <li><a href="https://www.javascript.com/">JavaScript</a></li>
  </ul>
</details>

<details>
  <summary>Server</summary>
  <ul>
    <li><a href="https://nodejs.dev/en/">Node</a></li>
    <li><a href="https://expressjs.com/">Express.js</a></li>
  </ul>
</details>

<details>
<summary>Database</summary>
  <ul>
    <li><a href="https://www.mongodb.com/">MongoDB</a></li>
    <li><a href="https://mongoosejs.com/">Mongoose</a></li>
  </ul>
</details>

<details>
<summary>DevOps</summary>
  <ul>
    <li><a href="https://circleci.com/">TBD</a></li>
  </ul>
</details>

<!-- Features -->

### :dart: Features

- Feature 1
- Feature 2
- Feature 3

<!-- Color Reference -->

### :art: Color Reference

| Color           | Hex                                                              |
| --------------- | ---------------------------------------------------------------- |
| Primary Color   | ![#222831](https://via.placeholder.com/10/222831?text=+) #222831 |
| Secondary Color | ![#393E46](https://via.placeholder.com/10/393E46?text=+) #393E46 |
| Accent Color    | ![#00ADB5](https://via.placeholder.com/10/00ADB5?text=+) #00ADB5 |
| Text Color      | ![#EEEEEE](https://via.placeholder.com/10/EEEEEE?text=+) #EEEEEE |

<!-- Env Variables -->

### :key: Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT`

`HOST`

`HOST_URL`

<!-- Getting Started -->

## :toolbox: Getting Started

<!-- Running Tests -->

### :test_tube: Running Tests

To set up testing webhook endpoints

```bash
  stripe listen --forward-connect-to http://localhost:8080/webhook/connect
```

<!-- Run Locally -->

### :running: Run Locally

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run serverstart
```

<!-- Deployment -->

### :triangular_flag_on_post: Deployment

To deploy this project run

```bash
  TBD
```

<!-- Usage -->

## :eyes: Usage

Use this space to tell a little more about your project and how it can be used. Show additional screenshots, code samples, demos or link to other resources.

```javascript
import Component from "my-project";

function App() {
  return <Component />;
}
```

<!-- Roadmap -->

## :compass: Roadmap

#### Check-ins/Reminders:

- [ ] Figure out region list
- [ ] Determine sanitize and validate reqs on page/user/creator/membership
- [ ] Format emails and wording/branding

#### Before Going Live:

- [ ] Create production Stripe webhook endpoints
- [ ] Replace all instances of HTTP to HTTPS
  - [ ] stripeController.js
  - [ ] authController.js
  - [ ] app.js (app.use(session){...})
- [ ] Replace env email to stmb email
- [ ] Replace MONGODB_TEST_URI
- [ ] Replace Stripe secret key
- [ ] confirmSubscription change publishable key from test
- [ ] Change app.js session to include http/secure only
- [ ] Webhooks
  - [ ] Flip livemode check

### Checklist

- [x] Initial set up

- [x] Database set up

- [x] Security set up

- [x] Controllers set up

  - [x] Auth

  - [ ] Creator

    - [x] Creator sign up
      - [ ] Info box for if genre not found, contact admin
    - [x] Connecting Stripe account

  - [ ] Page

    - [x] Page viewing
    - [x] Page editing
    - [ ] Posts
      - [ ] video
        - [ ] embed more than youtube?
        - [ ] check security issue with CSP for iframe
      - [x] image
      - [x] link
      - [x] text
    - [x] Membership creation
    - [x] Page creation

  - [x] Memberships

    - [x] Create membership
    - [x] Delete membership
    - [x] Edit membership

  - [x] Subscriptions

    - [x] Create subscriptions
    - [x] Delete/Cancel subscriptions
    - [x] Filter subscriptions by status

  - [x] Search
    - [x] By name
    - [x] By genre

- [x] File Storage Set up (AWS s3)

- [x] Stripe set up

  - [x] Connect stripe
  - [x] Stripe accounts

    - [x] Creator account onboarding
    - [x] Stripe users

  - [ ] Set up webhooks to listen for changes

    - [ ] Connected Accounts
      - [ ] Account Deauthorized
      - [x] Account updated
        - [x] Check for Stripe authorized for payment reciept
      - [ ] External Account updated
      - [ ] Balance available
      - [ ] Payment intent succeeded
      - [ ] Payout Failed
    - [ ] Users
      - [x] Subscription added
      - [ ] Monthly renewal (invoice.paid)
      - [ ] Renewal failure (invoice.payment_failed)
      - [x] customer.subscription.deleted
      - [x] Membership gets deleted

<!-- FAQ -->

## :grey_question: FAQ

- Question 1

<!-- License -->

## :warning: License

Distributed under the no License. See LICENSE.txt for more information.

<!-- Contact -->

## :handshake: Contact

<!-- Acknowledgments -->

## :gem: Acknowledgements

Use this section to mention useful resources and libraries that you have used in your projects.
