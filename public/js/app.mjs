// import $ from './jquery.js'
import html2haml from './html2haml.mjs'

$(() => {
    window.app = new App();
    $('.ui.tabular.menu .item').tab()
    $('#toggle-section-borders').on('click', () => { $('section').toggleClass('hideSectionBorders') })
})
window.dragItem = null;

class App {
    constructor() {
        this.components = {
            'two-column-grid': TwoColumnGrid,
            'three-column-grid': ThreeColumnGrid,
            'primary-button': PrimaryButton,
            'form': Form,
            'text-input': TextInput,
            'search-input': SearchInput,
            'table': CelledTable,
            'tabs': Tabs,
            'inline-elements': InlineElements,
            'message': Message,
            'error-message': ErrorMessage,
            'header': Header,
            'segment': Segment,
            'triple-segment': TripleSegment,
            'menu': Menu,
            'text-menu': TextMenu
        };

        for (const name in this.components) {
            let item = document.createElement('div');
            let $item = $(item)
            $item.data('component', name);
            $item.html(name);
            $item.prop('draggable', true)
            $item.addClass('item')
            $('#components').append($item);
        }
        $('#components .item').on('dragstart', (event) => {
            console.log('dragstart')
            window.dragItem = $(event.target).data('component')
        });

        $('section').on('dragover', (event) => {
            event.preventDefault();
            event.stopPropagation();
            console.log("over")
            $(event.target).addClass('dragover')
        })
        $('section').on('dragleave', (event) => {
            event.preventDefault();
            event.stopPropagation();
            console.log("out")
            $(event.target).removeClass('dragover')
        })
        $('section').on('drop', (event) => {
            event.preventDefault();
            event.stopPropagation();
            console.log("drop")
            const component_name = window.dragItem
            const component = new this.components[component_name];
            event.target.innerHTML = component.template;
            $(event.target).removeClass('dragover')

            this.renderMarkup()
        })

    }

    renderMarkup() {
        let dirtyHtml = $('#template').html()
        dirtyHtml = this.removeSegmentsTags(dirtyHtml);
        const tidyHtml = tidy_html5(dirtyHtml, {
            "show-body-only": true,
            "wrap": 200,
            "indent": true,
            "indent-spaces": 4
        });
        $('#markup').text(tidyHtml);
        $('#haml').text(html2haml(tidyHtml));
    }

    removeSegmentsTags(dirtyHtml){
        const parser = new DOMParser();
        const doc = parser.parseFromString(dirtyHtml, 'text/html');
        let sections = doc.querySelectorAll('section');
        sections.forEach(section => {
            section.insertAdjacentHTML('beforebegin', section.innerHTML);
            section.remove();
        });
        const cleanHtml = doc.body.innerHTML;
        return cleanHtml;
    }

}

class Component {
    constructor() {
    }
    randomId(){
        return 'id' + Math.floor(Math.random() * 9999)
    }
}

class Slot {
    constructor() {
    }
}

class TwoColumnGrid extends Component {
    constructor() {
        super()
        this.template = `
            <div>
                <div class="ui grid">
                  <div class="row">
                    <div class="eight wide column">
                        <section/>
                    </div>
                    <div class="eight wide column">
                        <section/>
                    </div>
                </div>
            </div>
        `
    }
}

class ThreeColumnGrid extends Component {
    constructor() {
        super()
        this.template = `
            <div>
                <div class="ui grid">
                  <div class="row">
                    <div class="five wide column">
                        <section/>
                    </div>
                    <div class="six wide column">
                        <section/>
                    </div>
                    <div class="five wide column">
                        <section/>
                    </div>
                </div>
            </div>
        `
    }
}

class PrimaryButton extends Component {
    constructor() {
        super()
        this.template = `
            <div>
                <button class='ui primary button'>button</button>
            </div>
        `
    }
}

class Form extends Component {
    constructor() {
        super();
        this.template = `
            <div>
                <form method="post" action="" class="ui form">
                    <section/>
                </form>
            </div>
`
    }
}

class TextInput extends Component {
    constructor() {
        super()
        this.id = this.randomId()
        this.template = `
            <div>
                <div class="field">
                    <label for="${this.id}">label</label>
                    <input type="text" id="${this.id}" name="" />
                </div>
            </div>`
    }
}

class SearchInput extends Component {
    constructor() {
        super()
        this.id = this.randomId()
        this.template = `
            <div>
                <div class='field'>
                    <label for="">label</label>
                    <input id="${this.id}" type="text" class="ui search selection" name="" />
                </div>
            </div>`
    }
}

class CelledTable extends Component {
    constructor() {
        super();
        this.template = `
<div>
    <table class="ui celled table">
      <thead>
        <tr><th>Header</th>
        <th>Header</th>
        <th>Header</th>
      </tr></thead>
      <tbody>
        <tr>
          <td><section/></td>
          <td><section/></td>
          <td><section/></td>
        </tr>
        <tr>
          <td><section/></td>
          <td><section/></td>
          <td><section/></td>
        </tr>
        <tr>
          <td><section/></td>
          <td><section/></td>
          <td><section/></td>
        </tr>
      </tbody>
    </table>
</div>
`
    }
}

class Tabs extends Component {
    constructor() {
        super();
        this.template = `
<div>
    <div class="ui top attached tabular menu">
      <a class="active item" data-tab="first">First</a>
      <a class="item" data-tab="second">Second</a>
      <a class="item" data-tab="third">Third</a>
    </div>
    <div class="ui bottom attached active tab segment" data-tab="first">
      <section/>
    </div>
    <div class="ui bottom attached tab segment" data-tab="second">
      <section/>
    </div>
    <div class="ui bottom attached tab segment" data-tab="third">
      <section/>
    </div>
</div>
`
    }
}

class InlineElements extends Component {
    constructor() {
        super();
        this.template = `
<div>
    <section></section>
    <section></section> 
    <section></section>
</div>
`
    }
}

class Message extends Component {
    constructor() {
        super();
        this.template = `
<div>
    <div class="ui message">
      <div class="header">
        Changes in Service
      </div>
      <p>We just updated our privacy policy here to better service our customers. We recommend reviewing the changes.</p>
    </div>
</div>
`
    }
}

class ErrorMessage extends Component {
    constructor() {
        super();
        this.template = `
<div>
    <div class="ui negative message">
        <i class="close icon"></i>
        <div class="header">
            We're sorry we can't apply that discount
        </div>
        <p>That offer has expired</p>
    </div>
</div>
`
    }
}

class Header extends Component {
    constructor() {
        super();
        this.template = `<h1>Header</h1>`
    }
}

class Segment extends Component {
    constructor() {
        super();
        this.template = `
<div>
    <div class="ui segment">
        <section></section>
    </div>
</div>
`
    }
}

class TripleSegment extends Component {
    constructor() {
        super();
        this.template = `
<div>
    <div class="ui segments">
        <div class="ui segment"><section></section></div>
        <div class="ui segment"><section></section></div>
        <div class="ui segment"><section></section></div>
    </div>
</div>
`
    }
}

class Menu extends Component {
    constructor() {
        super();
        this.template = `
<div>
    <div class="ui three item menu">
      <a class="active item">Editorials</a>
      <a class="item">Reviews</a>
      <a class="item">Upcoming Events</a>
    </div>
</div>
`
    }
}

class TextMenu extends Component {
    constructor() {
        super();
        this.template = `
<div>
    <div class="ui text menu">
        <div class="item">
            <i class="rocket icon"></i>
        </div>
        <a class="browse item">
            Browse Courses
            <i class="dropdown icon"></i>
        </a>
        <div class="ui right dropdown item">
            More
            <i class="dropdown icon"></i>
            <div class="menu">
                <div class="item">Applications</div>
                <div class="item">International Students</div>
                <div class="item">Scholarships</div>
            </div>
        </div>
    </div>
    <div class="ui flowing basic admission popup">
        <div class="ui three column relaxed divided grid">
            <div class="column">
                <h4 class="ui header">Business</h4>
                <div class="ui link list">
                    <a class="item">Design &amp; Urban Ecologies</a>
                    <a class="item">Fashion Design</a>
                    <a class="item">Fine Art</a>
                    <a class="item">Strategic Design</a>
                </div>
            </div>
            <div class="column">
                <h4 class="ui header">Liberal Arts</h4>
                <div class="ui link list">
                    <a class="item">Anthropology</a>
                    <a class="item">Economics</a>
                    <a class="item">Media Studies</a>
                    <a class="item">Philosophy</a>
                </div>
            </div>
            <div class="column">
                <h4 class="ui header">Social Sciences</h4>
                <div class="ui link list">
                    <a class="item">Food Studies</a>
                    <a class="item">Journalism</a>
                    <a class="item">Non Profit Management</a>
                </div>
            </div>
        </div>
    </div>
</div>
            `
    }
}