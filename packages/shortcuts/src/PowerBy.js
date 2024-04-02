import { LitElement, css, html } from 'lit';


class PowerBy extends LitElement {

  static properties = {
    since: { type: Number },
    to: { type: Number },
  };

  static styles = css`
    :host {
      font-size: 12px;
      text-align: right;
    }

    a {
      color: #337ab7;
      text-decoration: none;
    }

    a:focus,
    a:hover {
      color: #23527c;
      text-decoration: underline;
    }`;

  constructor() {
    super();

    this.to = (new Date()).getFullYear();
  }

  render() {
    return html`
			<p>
        Powered by <a href="http://getbootstrap.com/" target="_blank">Bootstrap</a>,
        <a href="https://svelte.dev/" target="_blank">Svelte</a>,
        <a href="https://lit.dev/" target="_blank">Lit</a>,
        <a href="https://materialdesignicons.com/" target="_blank">Material Design Icons</a>
      </p>
      <p>
        Theme from <a href="https://dribbble.com/shots/646349-Husk-io-topic-tiles" target="_blank">Husk.io</a>
      </p>
      <p>
        Atwood's Law: any application that can be written in JavaScript, will eventually be written in JavaScript.
        <sup><a href="http://blog.codinghorror.com/the-principle-of-least-power/" target="_blank">[1]</a></sup>
      </p>
      <p>
        ${this.since}-${this.to} © <a href="https://lisite.de" target="_blank">hbrls</a>
      </p>`;
  }
}


customElements.define('power-by', PowerBy);
