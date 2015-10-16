var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
exports['Update Review'] = function (evt) {
    var win = WindowManager.createWindow({
        backgroundColor: 'white'
    });
    var content = Ti.UI.createScrollView({
        top: 0,
        contentHeight: 'auto',
        layout: 'vertical'
    });
    win.add(content);

    var contentText = Ti.UI.createTextField({
        hintText: 'Content',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u,
        height: 40 + Utils.u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED
    });
    content.add(contentText);

    var rating = Ti.UI.createSlider({
        value: 5, min: 1, max: 5,
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u,
        height: 40 + Utils.u
    });
    content.add(rating);

    var button = Ti.UI.createButton({
        title: 'Update',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u, bottom: 10 + Utils.u,
        height: 40 + Utils.u
    });
    content.add(button);

    function submitForm() {
        button.hide();

        Cloud.Reviews.update({
            user_id: evt.user_id,
            review_id: evt.review_id,
            content: contentText.value,
            rating: rating.value
        }, function (e) {
            if (e.success) {
                alert('Updated!');
            }
            else {
                Utils.error(e);
            }
            button.show();
        });
    }

    button.addEventListener('click', submitForm);
    var fields = [ contentText ];
    for (var i = 0; i < fields.length; i++) {
        fields[i].addEventListener('return', submitForm);
    }

    var status = Ti.UI.createLabel({
        text: 'Loading, please wait...', textAlign: 'center',
        top: 0, right: 0, bottom: 0, left: 0,
        backgroundColor: '#fff', zIndex: 2
    });
    win.add(status);

    win.addEventListener('open', function () {
        Cloud.Reviews.show({
            user_id: evt.user_id,
            review_id: evt.review_id
        }, function (e) {
            status.hide();
            if (e.success) {
                var review = e.reviews[0];
                contentText.value = review.content;
                rating.value = review.rating;
                contentText.focus();
            }
            else {
                Utils.error(e);
            }
        });
    });
    return win;
};