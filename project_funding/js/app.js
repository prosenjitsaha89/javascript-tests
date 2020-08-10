(function (global) {

    var _parentRef = '';
    var _totalDonation = 0;
    var _template = `
        <div id="remainingDonation" class="tool-tip mb-3"></div>
        <div class="progress border">
            <div id="progressBar" class="progress-bar" style="width: 0%"></div>
        </div>
        <div class="donation-card-body border border-top-0 p-5">
            <p class="mt-0">
                <span class="highlight">Only 3 days left</span>
                to fund this project.
            </p>
            <p>
                Join the
                <b id="donarCount">0</b>
                other donors who hae already supported this project. Every dollar helps.
            </p>
            <div class="d-flex">
                <div class="d-flex w-50 mr-1">
                    <div class="input-group-prepend">
                        <span class="input-group-text">$</span>
                    </div>
                    <input 
                        id="donationInput"
                        type="text" 
                        class="form-control border-left-0">
                </div>
                <div class="w-50 ml-1">
                    <button 
                        id="donateButton"
                        type="button" 
                        class="btn btn-success p-3 w-100">Give Now</button>
                </div>
            </div>
            <p class="hint mb-0">Why give $50?</p>
        </div>
        <!-- Feature Buttons -->
        <div class="d-flex my-3">
            <button 
                type="button" 
                class="btn btn-light w-100 border p-3 mr-1">
                Save for Later
            </button>
            <button 
                type="button" 
                class="btn btn-light w-100 border p-3 ml-1">
                Tell your friends
            </button>
        </div>`;
    var _donationCompletionPercentage = '',
        _isExternalTemplate = false,
        _donateBtnRef = 'donateButton',
        _inputIdRef = 'donationInput',
        _donarCountRef = 'donarCount',
        _remainingDonationRef = 'remainingDonation',
        _progressBar = 'progressBar',
        _latestDonation = 0,
        _listofDonner = [],
        _remainigDonation = 0,
        _collectedDonation = 0;

    var calculateDonation = function () {
        addDonner();
        calculateRemainingDonation();
        calculateCollectedDonation();
        calculateDonationProgress();
        updateUI();
        freezeFunding();
    }

    var addDonner = function () {
        if (!_latestDonation) return;
        var donner = new Donner();
        donner.setDonationAmount(Number(_latestDonation));
        _latestDonation = 0;
        _listofDonner.push(donner);
    }

    var calculateRemainingDonation = function () {
        _remainigDonation = Number(_listofDonner.reduce(function (total, val) {
            return total - val.getDonationAmount();
        }, _totalDonation));
    }

    var calculateCollectedDonation = function () {
        _collectedDonation = Number(_listofDonner.reduce(function (total, val) {
            return total + val.getDonationAmount();
        }, 0));
    }

    var calculateDonationProgress = function () {
        _donationCompletionPercentage = (_remainigDonation >= 500) ? '0%' : (100 - (_remainigDonation * 100) / _totalDonation) + '%';
    }

    var freezeFunding = function () {
        if (_remainigDonation <= 0) {
            document.getElementById(_donateBtnRef).setAttribute('disabled', 'true');
            document.getElementById(_inputIdRef).setAttribute('disabled', 'true');

            global.document.getElementById('donationPanel').dispatchEvent(new CustomEvent('donationcomplete', {
                detail: {
                    collection: '$' + _collectedDonation,
                    donner: _listofDonner.length,
                    donation: '$' + _totalDonation
                }
            }));
        }
    }

    var updateUI = function () {
        global.document.getElementById(_inputIdRef).value = '';
        global.document.getElementById(_donarCountRef).innerHTML = _listofDonner.length;
        global.document.getElementById(_remainingDonationRef).innerHTML =
            (_remainigDonation <= 0) ? 'Hurrah! Project Funding is complete.' : '<b>$' + _remainigDonation + '</b> still needed for this project';
        global.document.getElementById(_progressBar).style = 'width:' + _donationCompletionPercentage;
    }

    var validateAndStoreDonationInput = function () {
        if (Number(global.document.getElementById(_inputIdRef).value) > 0) {
            _latestDonation = global.document.getElementById(_inputIdRef).value;
        } else {
            _latestDonation = 0;
            global.document.getElementById(_inputIdRef).value = '';
        }
    }

    var DonationWidget = function (totalDonation) {
        return new DonationWidget.init(totalDonation);
    }

    DonationWidget.prototype = {
        setTemplate: function (template) {
            if (template) {
                _template = template;
                _isExternalTemplate = true;
            }
        },
        getTemplate: function () {
            return _template;
        },
        render: function (parentId) {
            if (!global.document.getElementById(parentId)) {
                throw new Error('Provide A valid DOM element');
            }
            var parentRef = global.document.getElementById(parentId);
            parentRef.innerHTML = this.getTemplate();
            _parentRef = parentId;
            updateUI();
        },
        setOnDonationListener: function (donateBtn) {
            var btn = (_isExternalTemplate && donateBtn) ? donateBtn : _donateBtnRef;
            global.document.getElementById(btn).addEventListener('click', calculateDonation);
        },
        setDonationInputListener: function (inputId) {
            var inpt = (_isExternalTemplate && inputId) ? inputId : _inputIdRef;
            global.document.getElementById(inpt).addEventListener('keyup', validateAndStoreDonationInput);
        },
        reset: function () {
            global.document.getElementById(_donateBtnRef).removeEventListener();
            global.document.getElementById(_inputIdRef).removeEventListener();
            _totalDonation = 0;
            _remainigDonation = 0;
        }
    }

    DonationWidget.init = function (totalDonation) {
        _totalDonation = totalDonation;
        _remainigDonation = totalDonation;
    }

    DonationWidget.init.prototype = DonationWidget.prototype;

    var Donner = function () {}

    Donner.prototype.donation = 0;
    Donner.prototype.getDonationAmount = function () {
        return this._donation;
    };
    Donner.prototype.setDonationAmount = function (donation) {
        this._donation = donation || this._donation;
    };

    return (global) ? global.DonationWidget = DonationWidget : new Error('Global context not yet defined');

})(window)

const donation = DonationWidget(500);

window.onload = function () {
    donation.render('donationPanel');
    donation.setDonationInputListener();
    donation.setOnDonationListener();
    document.getElementById('donationPanel').addEventListener('donationcomplete', onDonationComplete);
}

function onDonationComplete(e) {
    alert('Donation Complete! ' + JSON.stringify(e.detail));
}