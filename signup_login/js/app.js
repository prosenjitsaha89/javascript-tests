'use strict';

var currentAction,
    lastAction,
    template = {
        signup: `<h3 class="form-heading">Sign Up for Free</h3>
        <form id="form">
            <div class="d-flex mb-3">
                <input
                    id="firstname"
                    name="firstname"
                    type="text"
                    autocomplete="off"
                    placeholder="First Name*"
                    class="form-control text-white mr-1"
                    required>
                <input
                    id="lastname"
                    name="lastname"
                    type="text"
                    autocomplete="off"
                    placeholder="Last Name*"
                    class="form-control text-white ml-1"
                    required>
            </div>
            <div class="d-flex mb-3">
                <input
                    id="email"
                    name="email"
                    type="email"
                    autocomplete="off"
                    placeholder="Email Address*"
                    class="form-control text-white"
                    required>
            </div>
            <div class="d-flex mb-3">
                <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Set A Password*"
                    class="form-control text-white"
                    required>
            </div>
            <div class="mb-3">
                <button
                    type="submit"
                    class="btn btn-primary jumbo p-2 w-100">
                    Get Started
                </button>
            </div>
        </form>`,
        login: `<h3 class="form-heading">Log In</h3>
        <form id="form">
            <div class="d-flex mb-3">
                <input
                    id="username"
                    name="username"
                    type="text"
                    autocomplete="off"
                    placeholder="User Name*"
                    class="form-control text-white"
                    required>
            </div>
            <div class="d-flex mb-3">
                <input
                    id="password"
                    name="password"
                    type="password"
                    autocomplete="off"
                    placeholder="Password*"
                    class="form-control text-white"
                    required>
            </div>
            <div class="mb-3">
                <button
                    type="submit"
                    class="btn btn-primary jumbo p-2 w-100">
                    Log In
                </button>
            </div>
        </form>`
    };

function appendTemplate(formTemplate) {
    const templateOutlet = document.getElementById('templateOutlet');
    templateOutlet.innerHTML = formTemplate;
}

function toggleStyleClass(id, asClass, rsClass) {
    if (id && asClass && rsClass) {
        const element = document.getElementById(id);
        element.classList.remove(rsClass);
        element.classList.add(asClass);
    }
}

function onBtnToggle() {

    currentAction = event.target.id;

    if (currentAction === lastAction) {
        return;
    } else {
        toggleStyleClass(currentAction, 'btn-primary', 'btn-secondary');
        toggleStyleClass(lastAction, 'btn-secondary', 'btn-primary');
        appendTemplate(template[currentAction]);
        initFormValidation();
    }

    lastAction = event.target.id;
}

function initFormValidation() {

    const form = document.getElementById('form');

    validate(form, {
        onSubmit: value => console.log(JSON.stringify(value)),
        onFormSuccess: value => console.log('Form is valid!'),
        onFormFail: value => console.log('Form is not valid!')
    });
}

window.onload = function () {

    lastAction = 'signup';

    appendTemplate(template.signup);
    initFormValidation();
}