# Sub-Troll (lithic-card-manager)

App to controll subscriptions using lithic virtual cards and connect with data from apps that rate or manage subscription services. Made to be a companion for What2Watchlist.com.

Phone App for users to manage virtual cards.

Allows a web service to suggest best available services and let the user manage their payment process. Intended for small teams not able to take on the liability of issuing cards in peoples names.

Built for What2Watchlist but capable of extending to other services.

## Install and run app

```bash
  npm install
  npm run dev
```

## Development Roadmap

- Functional Priorities: (get app running)

  1. **Services Login:**

  - [ ] Login page - drawrer (probably prefered.)
    - [ ] Reroute here if not yet logged in.
  - [x] Persist login session key.
  - [ ] Create a generic interface for the login and subscription logic. Make it extensible for different services
        (e.g., video streaming subscriptions, gym memberships, insurace, cloud storage).
  - [ ] Implement a mechanism to switch between different services.

  2. **Services Subscription manager:**

  - [ ] Subscription page.
    - [ ] List services from logged in service.
    - [ ] Service leads to add virtual card logic. Logic implementation specifics in part 3.
    - [ ] Persist service data. used to inform user to what service a given card is associated with.

  3. **Virtual Cards API Integration: (Privacy.com and Lithic.com)**

  - [ ] API page for virtual card service.
    - [ ] API key field and persistent store.
    - [ ] Toogle for diferentiating between Privacy.com and Lithic.com API keys.
    - [ ] Show transaction history (paginate)
  - [ ] Page for managing virtual cards.
    - [ ] List virtual cards.
    - [ ] Edit virtual cards.
    - [ ] Detach virtual card from subscription.
  - [ ] Integrate virtual cards with subscription page actions.
    - [ ] List virtual cards with add new card option. if no virtual cards go straight to adding a card.
    - [ ] add new virtual card for subscription. Include notice-warning to check associated fees.

  4. **Security & Persistence:**

  - [ ] Explore options for securely storing sensitive information on the client.
  - [ ] Persisting user preferences and login state securely between app sessions.
  - [ ] Ensure that sensitive information (e.g., API keys) is handled securely.
  - [ ] Implement secure practices for user authentication and authorization.

- Long term stable development tasks: (get app to stable)

  4. **Error Handling and Logging:**

  - [ ] Implement proper error handling throughout the app.
  - [ ] Add logging to track important events and potential issues.

  5. **Testing:**

  - [ ] Write unit tests for critical functions and components.
  - [ ] Test the app on different devices and browsers to ensure compatibility.

  6. **Documentation:**

  - [ ] Overview of folder structure
  - [ ] Mobx store data maping relationship. ex there are multiple logins posible each one gives a list of
        subscriptions and we keep track of what virtual card you wish to use to pay-manage that service.
        Document or diagram appropriately.
  - [ ] Provide clear instructions for other developers (or future you) on how to set up and run the app.

- Optional project goals:

  7. **Performance & usability Optimization:**

  - [ ] Identify and address possible performance concerns.
  - [ ] Identify and address usability pain points. Maybe crate a feature overview or tutorial script.

  8. **Deployment:**

  - [ ] Set up a deployment pipeline for building and deploying your PWA.
  - [ ] Ensure that the app works correctly in a production environment.

  9. **Internationalization (i18n):**

  - [ ] implement internationalization for the app to support multiple languages.
