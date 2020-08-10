(function (global) {

    'use strict';

    var _defaults = {
        errorStyle: 'is-invalid',
        successStyle: 'is-valid',
        requiredAttr: 'required',
        onSubmit: function () {},
        onFormSuccess: function () {},
        onFormFail: function () {}
    };

    function validate(form, options) {

        var widget = this;
        this.form = form;
        this.settings = Object.assign({}, _defaults, options);

        this.form.addEventListener('submit', e => {

            e.preventDefault();

            for (let control of this.form.elements) {
                control.checkValidity() ? widget.markValid(control) : widget.markError(control);
                control.addEventListener('input', _ => {
                    control.checkValidity() ? widget.markValid(control) : widget.markError(control);
                });
            };

            widget.settings.onSubmit(this.value(this.form));

            (this.form.checkValidity()) ?
            widget.settings.onFormSuccess(this.value(this.form)):
                widget.settings.onFormFail(this.value(this.form));
        });

        this.init();
    }

    validate.prototype = {

        init: function () {
            this.form.setAttribute('novalidate', true);
        },

        markError: function (element) {
            element.classList.remove(this.settings.successStyle);
            element.classList.add(this.settings.errorStyle);
        },

        markValid: function (element) {
            element.classList.remove(this.settings.errorStyle);
            element.classList.add(this.settings.successStyle);
        },

        value: function (element) {
            const value = Object.values(element).reduce(
                (obj, field) => {
                    if (field.name) {
                        obj[field.name] = field.value;
                    }
                    return obj;
                }, {});

            return value;
        }
    };

    global.validate = function (form, options) {
        new validate(form, options);
        return this;
    };

})(window);