// Select color input
// Select size input
// When size is submitted by the user, call makeGrid()

// Variables

const colorValue = $('#color_picker');
const table = $('#pixel_canvas');

// Instructions behavior

colorValue.on('change', function() {
   $('.table-cell').css("background-color", colorValue.val());
});

// Grid creation

function makeGrid(e) {
    e.preventDefault();
    table.find('*').remove();
    const height = $('#input_height').val();
    const width = $('#input_width').val();
    for (let row = 0; row < height; row++) {
        const tr = $('<tr></tr>').appendTo(table);
        for (let cell = 0; cell < width; cell++) {
            $('<td></td>').appendTo(tr);
        }
    }
}

$('#size_picker').on('submit', makeGrid);

// Set and remove cell color

function toggleColor() {
    if( $(this).css("background-color") == 'rgb(255, 255, 255)') {
        $(this).css("background-color", colorValue.val());
    } else $(this).css("background-color", '#fff');
}

table.on('click', 'td', toggleColor); // or function name: toggleColorWithClass

// Diferent way to set/remove cell color

function toggleColorWithClass() {
    if( $(this).hasClass('colorIsSet')) {
        $(this).css("background-color", '#fff');
        $(this).removeClass('colorIsSet');
    } else {
        $(this).css("background-color", colorValue.val());
        $(this).addClass('colorIsSet');
    }
}
