/*jshint browser: true */

export const writeTitle = (title) => {
    var heading = document.createElement('H4');
    var titleText = document.createTextNode(title);
    heading.appendChild(titleText);
    document.body.appendChild(heading);
};
