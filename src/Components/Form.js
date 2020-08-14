import React, { Component } from "react";
const validUrlRegex = RegExp("^(http|https)://[^./]+(?:\\.[^./]+)+(?:\\/.*)?$");

const validateForm = (errors) => {
  let valid = true;
  if (errors.length > 0) {
    valid = false;
  }
  return valid;
};

export default class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      longUrl: "",
      shortUrl: "",
      errors: "",
      showURL: false,
      showError: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ showError: false });
    this.setState({ showURL: false });
    this.setState({ longUrl: event.target.value });
    validUrlRegex.test(event.target.value)
      ? this.setState({ errors: "" })
      : this.setState({ errors: "Please enter a valid url." });
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ longUrl: "" });
    if (validateForm(this.state.errors)) {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({ longURL: this.state.longUrl }),
      };
      const url = "http://localhost:8080/api/create/";
      await fetch(url, requestOptions)
        .then((response) => {
          if (!response.ok) throw new Error(response.status);
          else return response.json();
        })
        .then((data) => {
          this.setState({ shortUrl: data.shortURL });
          this.setState({ showURL: true });
        })
        .catch((error) => {
          this.setState({ showError: true });
          console.log("error: " + error);
        });
    }
  }

  render() {
    const { longUrl, shortUrl, errors, showURL, showError } = this.state;
    return (
      <div className="container">
        <div className="form-container">
          <h2 className="title">Create a Short Url</h2>
          <form className="form" onSubmit={this.handleSubmit}>
            <div className="long-url">
              <label>Please enter the long url: </label>
              <input
                type="text"
                value={longUrl}
                onChange={this.handleChange}
                placeholder=" https://www.example.com"
              />
              {errors.length > 0 && <span className="error">{errors}</span>}
            </div>
            <div className="submit-button-container">
              <input
                type="submit"
                value="Submit"
                disabled={!this.state.longUrl || errors.length > 0}
              />
            </div>
            <div className="short-url">
              {showURL && (
                <p>
                  Success! A short url was created:
                  <span>
                    &nbsp;
                    <a href={shortUrl}>{shortUrl}</a>
                  </span>
                </p>
              )}
            </div>
            <div className="error">
              {showError && <p>Request failed, please try again.</p>}
            </div>
          </form>
        </div>
      </div>
    );
  }
}
