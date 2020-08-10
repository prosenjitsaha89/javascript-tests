var Button = function () {

    var _name;

    this.render = function (i, cosmetic) {
        this.button = document.createElement('button');
        this.button.className = cosmetic;
        _name = 'Button' + i;
        this.button.innerText = _name;
        return this;
    };

    this.appendToContext = function (c) {
        const context = document.querySelector(c);
        context.appendChild(this.button);
        return this;
    };

    this.printInfo = function (i) {
        this.button.addEventListener('click', function () {
            const context = document.querySelector('h3');
            context.innerText = 'Name:' + _name + ', Index:' + i;
        });
        return this;
    };
};

var renderButtonSet = function (count, context, cosmetic) {
    for (let i = 0; i < count; i++) {
        const button = new Button();
        button.render(i, cosmetic).appendToContext(context).printInfo(i);
    }
};

window.onload = function () {
    renderButtonSet(5, 'body', 'btn btn-success mr-1');
};