# FastAPI { #fastapi }

<style>
.md-content .md-typeset h1 { display: none; }
</style>

<p align="center">
  <a href="https://fastapi.tiangolo.com"><img src="https://fastapi.tiangolo.com/img/logo-margin/logo-teal.png" alt="FastAPI"></a>
</p>
<p align="center">
    <em>FastAPI framework, high performance, easy to learn, fast to code, ready for production</em>
</p>
<p align="center">
<a href="https://github.com/fastapi/fastapi/actions?query=workflow%3ATest+event%3Apush+branch%3Amaster">
    <img src="https://github.com/fastapi/fastapi/actions/workflows/test.yml/badge.svg?event=push&branch=master" alt="Test">
</a>
<a href="https://coverage-badge.samuelcolvin.workers.dev/redirect/fastapi/fastapi">
    <img src="https://coverage-badge.samuelcolvin.workers.dev/fastapi/fastapi.svg" alt="Coverage">
</a>
<a href="https://pypi.org/project/fastapi">
    <img src="https://img.shields.io/pypi/v/fastapi?color=%2334D058&label=pypi%20package" alt="Package version">
</a>
<a href="https://pypi.org/project/fastapi">
    <img src="https://img.shields.io/pypi/pyversions/fastapi.svg?color=%2334D058" alt="Supported Python versions">
</a>
</p>

---

**Documentation**: [https://fastapi.tiangolo.com](https://fastapi.tiangolo.com)

**Source Code**: [https://github.com/fastapi/fastapi](https://github.com/fastapi/fastapi)

---

FastAPI is a modern, fast (high-performance), web framework for building APIs with Python based on standard Python type hints.

The key features are:

* **Fast**: Very high performance, on par with **NodeJS** and **Go** (thanks to Starlette and Pydantic). [One of the fastest Python frameworks available](#performance).
* **Fast to code**: Increase the speed to develop features by about 200% to 300%. *
* **Fewer bugs**: Reduce about 40% of human (developer) induced errors. *
* **Intuitive**: Great editor support. <dfn title="also known as auto-complete, autocompletion, IntelliSense">Completion</dfn> everywhere. Less time debugging.
* **Easy**: Designed to be easy to use and learn. Less time reading docs.
* **Short**: Minimize code duplication. Multiple features from each parameter declaration. Fewer bugs.
* **Robust**: Get production-ready code. With automatic interactive documentation.
* **Standards-based**: Based on (and fully compatible with) the open standards for APIs: [OpenAPI](https://github.com/OAI/OpenAPI-Specification) (previously known as Swagger) and [JSON Schema](https://json-schema.org/).

<small>* estimation based on tests conducted by an internal development team, building production applications.</small>

## Sponsors { #sponsors }

<!-- sponsors -->

### Keystone Sponsor { #keystone-sponsor }

{% for sponsor in sponsors.keystone -%}
<a href="{{ sponsor.url }}" title="{{ sponsor.title }}"><img src="{{ sponsor.img }}" style="border-radius:15px"></a>
{% endfor -%}

### Gold and Silver Sponsors { #gold-and-silver-sponsors }

{% for sponsor in sponsors.gold -%}
<a href="{{ sponsor.url }}" title="{{ sponsor.title }}"><img src="{{ sponsor.img }}" style="border-radius:15px"></a>
{% endfor -%}
{%- for sponsor in sponsors.silver -%}
<a href="{{ sponsor.url }}" title="{{ sponsor.title }}"><img src="{{ sponsor.img }}" style="border-radius:15px"></a>
{% endfor %}

<!-- /sponsors -->

[Other sponsors](https://fastapi.tiangolo.com/fastapi-people/#sponsors)

## Opinions { #opinions }

"_[...] I'm using **FastAPI** a ton these days. [...] I'm actually planning to use it for all of my team's **ML services at Microsoft**. Some of them are getting integrated into the core **Windows** product and some **Office** products._"

<div style="text-align: right; margin-right: 10%;">Kabir Khan - <strong>Microsoft</strong> <a href="https://github.com/fastapi/fastapi/pull/26"><small>(ref)</small></a></div>

---

"_We adopted the **FastAPI** library to spawn a **REST** server that can be queried to obtain **predictions**. [for Ludwig]_"

<div style="text-align: right; margin-right: 10%;">Piero Molino, Yaroslav Dudin, and Sai Sumanth Miryala - <strong>Uber</strong> <a href="https://eng.uber.com/ludwig-v0-2/"><small>(ref)</small></a></div>

---

"_**Netflix** is pleased to announce the open-source release of our **crisis management** orchestration framework: **Dispatch**! [built with **FastAPI**]_"

<div style="text-align: right; margin-right: 10%;">Kevin Glisson, Marc Vilanova, Forest Monsen - <strong>Netflix</strong> <a href="https://netflixtechblog.com/introducing-dispatch-da4b8a2a8072"><small>(ref)</small></a></div>

---

"_I’m over the moon excited about **FastAPI**. It’s so fun!_"

<div style="text-align: right; margin-right: 10%;">Brian Okken - <strong>[Python Bytes](https://pythonbytes.fm/episodes/show/123/time-to-right-the-py-wrongs?time_in_sec=855) podcast host</strong> <a href="https://x.com/brianokken/status/1112220079972728832"><small>(ref)</small></a></div>

---

"_Honestly, what you've built looks super solid and polished. In many ways, it's what I wanted **Hug** to be - it's really inspiring to see someone build that._"

<div style="text-align: right; margin-right: 10%;">Timothy Crosley - <strong>[Hug](https://github.com/hugapi/hug) creator</strong> <a href="https://news.ycombinator.com/item?id=19455465"><small>(ref)</small></a></div>

---

"_If you're looking to learn one **modern framework** for building REST APIs, check out **FastAPI** [...] It's fast, easy to use and easy to learn [...]_"

"_We've switched over to **FastAPI** for our **APIs** [...] I think you'll like it [...]_"

<div style="text-align: right; margin-right: 10%;">Ines Montani - Matthew Honnibal - <strong>[Explosion AI](https://explosion.ai) founders - [spaCy](https://spacy.io) creators</strong> <a href="https://x.com/_inesmontani/status/1144173225322143744"><small>(ref)</small></a> - <a href="https://x.com/honnibal/status/1144031421859655680"><small>(ref)</small></a></div>

---

"_If anyone is looking to build a production Python API, I would highly recommend **FastAPI**. It is **beautifully designed**, **simple to use** and **highly scalable**, it has become a **key component** in our API first development strategy and is driving many automations and services such as our Virtual TAC Engineer._"

<div style="text-align: right; margin-right: 10%;">Deon Pillsbury - <strong>Cisco</strong> <a href="https://www.linkedin.com/posts/deonpillsbury_cisco-cx-python-activity-6963242628536487936-trAp/"><small>(ref)</small></a></div>

---

## FastAPI mini documentary { #fastapi-mini-documentary }

There's a [FastAPI mini documentary](https://www.youtube.com/watch?v=mpR8ngthqiE) released at the end of 2025, you can watch it online:

<a href="https://www.youtube.com/watch?v=mpR8ngthqiE"><img src="https://fastapi.tiangolo.com/img/fastapi-documentary.jpg" alt="FastAPI Mini Documentary"></a>

## **Typer**, the FastAPI of CLIs { #typer-the-fastapi-of-clis }

<a href="https://typer.tiangolo.com"><img src="https://typer.tiangolo.com/img/logo-margin/logo-margin-vector.svg" style="width: 20%;"></a>

If you are building a <abbr title="Command Line Interface">CLI</abbr> app to be used in the terminal instead of a web API, check out [**Typer**](https://typer.tiangolo.com/).

**Typer** is FastAPI's little sibling. And it's intended to be the **FastAPI of CLIs**. ⌨️ 🚀

## Requirements { #requirements }

FastAPI stands on the shoulders of giants:

* [Starlette](https://www.starlette.dev/) for the web parts.
* [Pydantic](https://docs.pydantic.dev/) for the data parts.

## Installation { #installation }

Create and activate a [virtual environment](https://fastapi.tiangolo.com/virtual-environments/) and then install FastAPI:

<div class="termy">

```console
$ pip install "fastapi[standard]"

---> 100%
```

</div>

**Note**: Make sure you put `"fastapi[standard]"` in quotes to ensure it works in all terminals.

## Example { #example }

### Create it { #create-it }

Create a file `main.py` with:

```Python
from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}
```

<details markdown="1">
<summary>Or use <code>async def</code>...</summary>

If your code uses `async` / `await`, use `async def`:

```Python hl_lines="7  12"
from fastapi import FastAPI

app = FastAPI()


@app.get("/")
async def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
async def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}
```

**Note**:

If you don't know, check the _"In a hurry?"_ section about [`async` and `await` in the docs](https://fastapi.tiangolo.com/async/#in-a-hurry).

</details>

### Run it { #run-it }

Run the server with:

<div class="termy">

```console
$ fastapi dev main.py

 ╭────────── FastAPI CLI - Development mode ───────────╮
 │                                                     │
 │  Serving at: http://127.0.0.1:8000                  │
 │                                                     │
 │  API docs: http://127.0.0.1:8000/docs               │
 │                                                     │
 │  Running in development mode, for production use:   │
 │                                                     │
 │  fastapi run                                        │
 │                                                     │
 ╰─────────────────────────────────────────────────────╯

INFO:     Will watch for changes in these directories: ['/home/user/code/awesomeapp']
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [2248755] using WatchFiles
INFO:     Started server process [2248757]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

</div>

<details markdown="1">
<summary>About the command <code>fastapi dev main.py</code>...</summary>

The command `fastapi dev` reads your `main.py` file, detects the **FastAPI** app in it, and starts a server using [Uvicorn](https://www.uvicorn.dev).

By default, `fastapi dev` will start with auto-reload enabled for local development.

You can read more about it in the [FastAPI CLI docs](https://fastapi.tiangolo.com/fastapi-cli/).

</details>

### Check it { #check-it }

Open your browser at [http://127.0.0.1:8000/items/5?q=somequery](http://127.0.0.1:8000/items/5?q=somequery).

You will see the JSON response as:

```JSON
{"item_id": 5, "q": "somequery"}
```

You already created an API that:

* Receives HTTP requests in the _paths_ `/` and `/items/{item_id}`.
* Both _paths_ take `GET` <em>operations</em> (also known as HTTP _methods_).
* The _path_ `/items/{item_id}` has a _path parameter_ `item_id` that should be an `int`.
* The _path_ `/items/{item_id}` has an optional `str` _query parameter_ `q`.

### Interactive API docs { #interactive-api-docs }

Now go to [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

You will see the automatic interactive API documentation (provided by [Swagger UI](https://github.com/swagger-api/swagger-ui)):

![Swagger UI](https://fastapi.tiangolo.com/img/index/index-01-swagger-ui-simple.png)

### Alternative API docs { #alternative-api-docs }

And now, go to [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc).

You will see the alternative automatic documentation (provided by [ReDoc](https://github.com/Rebilly/ReDoc)):

![ReDoc](https://fastapi.tiangolo.com/img/index/index-02-redoc-simple.png)

## Example upgrade { #example-upgrade }

Now modify the file `main.py` to receive a body from a `PUT` request.

Declare the body using standard Python types, thanks to Pydantic.

```Python hl_lines="2  7-10 23-25"
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class Item(BaseModel):
    name: str
    price: float
    is_offer: bool | None = None


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}


@app.put("/items/{item_id}")
def update_item(item_id: int, item: Item):
    return {"item_name": item.name, "item_id": item_id}
```

The `fastapi dev` server should reload automatically.

### Interactive API docs upgrade { #interactive-api-docs-upgrade }

Now go to [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

* The interactive API documentation will be automatically updated, including the new body:

![Swagger UI](https://fastapi.tiangolo.com/img/index/index-03-swagger-02.png)

* Click on the button "Try it out", it allows you to fill the parameters and directly interact with the API:

![Swagger UI interaction](https://fastapi.tiangolo.com/img/index/index-04-swagger-03.png)

* Then click on the "Execute" button, the user interface will communicate with your API, send the parameters, get the results and show them on the screen:

![Swagger UI interaction](https://fastapi.tiangolo.com/img/index/index-05-swagger-04.png)

### Alternative API docs upgrade { #alternative-api-docs-upgrade }

And now, go to [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc).

* The alternative documentation will also reflect the new query parameter and body:

![ReDoc](https://fastapi.tiangolo.com/img/index/index-06-redoc-02.png)

### Recap { #recap }

In summary, you declare **once** the types of parameters, body, etc. as function parameters.

You do that with standard modern Python types.

You don't have to learn a new syntax, the methods or classes of a specific library, etc.

Just standard **Python**.

For example, for an `int`:

```Python
item_id: int
```

or for a more complex `Item` model:

```Python
item: Item
```

...and with that single declaration you get:

* Editor support, including:
    * Completion.
    * Type checks.
* Validation of data:
    * Automatic and clear errors when the data is invalid.
    * Validation even for deeply nested JSON objects.
* <dfn title="also known as: serialization, parsing, marshalling">Conversion</dfn> of input data: coming from the network to Python data and types. Reading from:
    * JSON.
    * Path parameters.
    * Query parameters.
    * Cookies.
    * Headers.
    * Forms.
    * Files.
* <dfn title="also known as: serialization, parsing, marshalling">Conversion</dfn> of output data: converting from Python data and types to network data (as JSON):
    * Convert Python types (`str`, `int`, `float`, `bool`, `list`, etc).
    * `datetime` objects.
    * `UUID` objects.
    * Database models.
    * ...and many more.
* Automatic interactive API documentation, including 2 alternative user interfaces:
    * Swagger UI.
    * ReDoc.

---

Coming back to the previous code example, **FastAPI** will:

* Validate that there is an `item_id` in the path for `GET` and `PUT` requests.
* Validate that the `item_id` is of type `int` for `GET` and `PUT` requests.
    * If it is not, the client will see a useful, clear error.
* Check if there is an optional query parameter named `q` (as in `http://127.0.0.1:8000/items/foo?q=somequery`) for `GET` requests.
    * As the `q` parameter is declared with `= None`, it is optional.
    * Without the `None` it would be required (as is the body in the case with `PUT`).
* For `PUT` requests to `/items/{item_id}`, read the body as JSON:
    * Check that it has a required attribute `name` that should be a `str`.
    * Check that it has a required attribute `price` that has to be a `float`.
    * Check that it has an optional attribute `is_offer`, that should be a `bool`, if present.
    * All this would also work for deeply nested JSON objects.
* Convert from and to JSON automatically.
* Document everything with OpenAPI, that can be used by:
    * Interactive documentation systems.
    * Automatic client code generation systems, for many languages.
* Provide 2 interactive documentation web interfaces directly.

---

We just scratched the surface, but you already get the idea of how it all works.

Try changing the line with:

```Python
    return {"item_name": item.name, "item_id": item_id}
```

...from:

```Python
        ... "item_name": item.name ...
```

...to:

```Python
        ... "item_price": item.price ...
```

...and see how your editor will auto-complete the attributes and know their types:

![editor support](https://fastapi.tiangolo.com/img/vscode-completion.png)

For a more complete example including more features, see the <a href="https://fastapi.tiangolo.com/tutorial/">Tutorial - User Guide</a>.

**Spoiler alert**: the tutorial - user guide includes:

* Declaration of **parameters** from other different places as: **headers**, **cookies**, **form fields** and **files**.
* How to set **validation constraints** as `maximum_length` or `regex`.
* A very powerful and easy to use **<dfn title="also known as components, resources, providers, services, injectables">Dependency Injection</dfn>** system.
* Security and authentication, including support for **OAuth2** with **JWT tokens** and **HTTP Basic** auth.
* More advanced (but equally easy) techniques for declaring **deeply nested JSON models** (thanks to Pydantic).
* **GraphQL** integration with [Strawberry](https://strawberry.rocks) and other libraries.
* Many extra features (thanks to Starlette) as:
    * **WebSockets**
    * extremely easy tests based on HTTPX and `pytest`
    * **CORS**
    * **Cookie Sessions**
    * ...and more.

### Deploy your app (optional) { #deploy-your-app-optional }

You can optionally deploy your FastAPI app to [FastAPI Cloud](https://fastapicloud.com), go and join the waiting list if you haven't. 🚀

If you already have a **FastAPI Cloud** account (we invited you from the waiting list 😉), you can deploy your application with one command.

Before deploying, make sure you are logged in:

<div class="termy">

```console
$ fastapi login

You are logged in to FastAPI Cloud 🚀
```

</div>

Then deploy your app:

<div class="termy">

```console
$ fastapi deploy

Deploying to FastAPI Cloud...

✅ Deployment successful!

🐔 Ready the chicken! Your app is ready at https://myapp.fastapicloud.dev
```

</div>

That's it! Now you can access your app at that URL. ✨

#### About FastAPI Cloud { #about-fastapi-cloud }

**[FastAPI Cloud](https://fastapicloud.com)** is built by the same author and team behind **FastAPI**.

It streamlines the process of **building**, **deploying**, and **accessing** an API with minimal effort.

It brings the same **developer experience** of building apps with FastAPI to **deploying** them to the cloud. 🎉

FastAPI Cloud is the primary sponsor and funding provider for the *FastAPI and friends* open source projects. ✨

#### Deploy to other cloud providers { #deploy-to-other-cloud-providers }

FastAPI is open source and based on standards. You can deploy FastAPI apps to any cloud provider you choose.

Follow your cloud provider's guides to deploy FastAPI apps with them. 🤓

## Performance { #performance }

Independent TechEmpower benchmarks show **FastAPI** applications running under Uvicorn as [one of the fastest Python frameworks available](https://www.techempower.com/benchmarks/#section=test&runid=7464e520-0dc2-473d-bd34-dbdfd7e85911&hw=ph&test=query&l=zijzen-7), only below Starlette and Uvicorn themselves (used internally by FastAPI). (*)

To understand more about it, see the section [Benchmarks](https://fastapi.tiangolo.com/benchmarks/).

## Dependencies { #dependencies }

FastAPI depends on Pydantic and Starlette.

### `standard` Dependencies { #standard-dependencies }

When you install FastAPI with `pip install "fastapi[standard]"` it comes with the `standard` group of optional dependencies:

Used by Pydantic:

* [`email-validator`](https://github.com/JoshData/python-email-validator) - for email validation.

Used by Starlette:

* [`httpx`](https://www.python-httpx.org) - Required if you want to use the `TestClient`.
* [`jinja2`](https://jinja.palletsprojects.com) - Required if you want to use the default template configuration.
* [`python-multipart`](https://github.com/Kludex/python-multipart) - Required if you want to support form <dfn title="converting the string that comes from an HTTP request into Python data">"parsing"</dfn>, with `request.form()`.

Used by FastAPI:

* [`uvicorn`](https://www.uvicorn.dev) - for the server that loads and serves your application. This includes `uvicorn[standard]`, which includes some dependencies (e.g. `uvloop`) needed for high performance serving.
* `fastapi-cli[standard]` - to provide the `fastapi` command.
    * This includes `fastapi-cloud-cli`, which allows you to deploy your FastAPI application to [FastAPI Cloud](https://fastapicloud.com).

### Without `standard` Dependencies { #without-standard-dependencies }

If you don't want to include the `standard` optional dependencies, you can install with `pip install fastapi` instead of `pip install "fastapi[standard]"`.

### Without `fastapi-cloud-cli` { #without-fastapi-cloud-cli }

If you want to install FastAPI with the standard dependencies but without the `fastapi-cloud-cli`, you can install with `pip install "fastapi[standard-no-fastapi-cloud-cli]"`.

### Additional Optional Dependencies { #additional-optional-dependencies }

There are some additional dependencies you might want to install.

Additional optional Pydantic dependencies:

* [`pydantic-settings`](https://docs.pydantic.dev/latest/usage/pydantic_settings/) - for settings management.
* [`pydantic-extra-types`](https://docs.pydantic.dev/latest/usage/types/extra_types/extra_types/) - for extra types to be used with Pydantic.

Additional optional FastAPI dependencies:

* [`orjson`](https://github.com/ijl/orjson) - Required if you want to use `ORJSONResponse`.
* [`ujson`](https://github.com/esnme/ultrajson) - Required if you want to use `UJSONResponse`.

## License { #license }

This project is licensed under the terms of the MIT license.
# First Steps { #first-steps }

The simplest FastAPI file could look like this:

{* ../../docs_src/first_steps/tutorial001_py310.py *}

Copy that to a file `main.py`.

Run the live server:

<div class="termy">

```console
$ <font color="#4E9A06">fastapi</font> dev <u style="text-decoration-style:solid">main.py</u>

  <span style="background-color:#009485"><font color="#D3D7CF"> FastAPI </font></span>  Starting development server 🚀

             Searching for package file structure from directories
             with <font color="#3465A4">__init__.py</font> files
             Importing from <font color="#75507B">/home/user/code/</font><font color="#AD7FA8">awesomeapp</font>

   <span style="background-color:#007166"><font color="#D3D7CF"> module </font></span>  🐍 main.py

     <span style="background-color:#007166"><font color="#D3D7CF"> code </font></span>  Importing the FastAPI app object from the module with
             the following code:

             <u style="text-decoration-style:solid">from </u><u style="text-decoration-style:solid"><b>main</b></u><u style="text-decoration-style:solid"> import </u><u style="text-decoration-style:solid"><b>app</b></u>

      <span style="background-color:#007166"><font color="#D3D7CF"> app </font></span>  Using import string: <font color="#3465A4">main:app</font>

   <span style="background-color:#007166"><font color="#D3D7CF"> server </font></span>  Server started at <font color="#729FCF"><u style="text-decoration-style:solid">http://127.0.0.1:8000</u></font>
   <span style="background-color:#007166"><font color="#D3D7CF"> server </font></span>  Documentation at <font color="#729FCF"><u style="text-decoration-style:solid">http://127.0.0.1:8000/docs</u></font>

      <span style="background-color:#007166"><font color="#D3D7CF"> tip </font></span>  Running in development mode, for production use:
             <b>fastapi run</b>

             Logs:

     <span style="background-color:#007166"><font color="#D3D7CF"> INFO </font></span>  Will watch for changes in these directories:
             <b>[</b><font color="#4E9A06">&apos;/home/user/code/awesomeapp&apos;</font><b>]</b>
     <span style="background-color:#007166"><font color="#D3D7CF"> INFO </font></span>  Uvicorn running on <font color="#729FCF"><u style="text-decoration-style:solid">http://127.0.0.1:8000</u></font> <b>(</b>Press CTRL+C
             to quit<b>)</b>
     <span style="background-color:#007166"><font color="#D3D7CF"> INFO </font></span>  Started reloader process <b>[</b><font color="#34E2E2"><b>383138</b></font><b>]</b> using WatchFiles
     <span style="background-color:#007166"><font color="#D3D7CF"> INFO </font></span>  Started server process <b>[</b><font color="#34E2E2"><b>383153</b></font><b>]</b>
     <span style="background-color:#007166"><font color="#D3D7CF"> INFO </font></span>  Waiting for application startup.
     <span style="background-color:#007166"><font color="#D3D7CF"> INFO </font></span>  Application startup complete.
```

</div>

In the output, there's a line with something like:

```hl_lines="4"
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

That line shows the URL where your app is being served on your local machine.

### Check it { #check-it }

Open your browser at [http://127.0.0.1:8000](http://127.0.0.1:8000).

You will see the JSON response as:

```JSON
{"message": "Hello World"}
```

### Interactive API docs { #interactive-api-docs }

Now go to [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

You will see the automatic interactive API documentation (provided by [Swagger UI](https://github.com/swagger-api/swagger-ui)):

![Swagger UI](https://fastapi.tiangolo.com/img/index/index-01-swagger-ui-simple.png)

### Alternative API docs { #alternative-api-docs }

And now, go to [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc).

You will see the alternative automatic documentation (provided by [ReDoc](https://github.com/Rebilly/ReDoc)):

![ReDoc](https://fastapi.tiangolo.com/img/index/index-02-redoc-simple.png)

### OpenAPI { #openapi }

**FastAPI** generates a "schema" with all your API using the **OpenAPI** standard for defining APIs.

#### "Schema" { #schema }

A "schema" is a definition or description of something. Not the code that implements it, but just an abstract description.

#### API "schema" { #api-schema }

In this case, [OpenAPI](https://github.com/OAI/OpenAPI-Specification) is a specification that dictates how to define a schema of your API.

This schema definition includes your API paths, the possible parameters they take, etc.

#### Data "schema" { #data-schema }

The term "schema" might also refer to the shape of some data, like a JSON content.

In that case, it would mean the JSON attributes, and data types they have, etc.

#### OpenAPI and JSON Schema { #openapi-and-json-schema }

OpenAPI defines an API schema for your API. And that schema includes definitions (or "schemas") of the data sent and received by your API using **JSON Schema**, the standard for JSON data schemas.

#### Check the `openapi.json` { #check-the-openapi-json }

If you are curious about how the raw OpenAPI schema looks like, FastAPI automatically generates a JSON (schema) with the descriptions of all your API.

You can see it directly at: [http://127.0.0.1:8000/openapi.json](http://127.0.0.1:8000/openapi.json).

It will show a JSON starting with something like:

```JSON
{
    "openapi": "3.1.0",
    "info": {
        "title": "FastAPI",
        "version": "0.1.0"
    },
    "paths": {
        "/items/": {
            "get": {
                "responses": {
                    "200": {
                        "description": "Successful Response",
                        "content": {
                            "application/json": {



...
```

#### What is OpenAPI for { #what-is-openapi-for }

The OpenAPI schema is what powers the two interactive documentation systems included.

And there are dozens of alternatives, all based on OpenAPI. You could easily add any of those alternatives to your application built with **FastAPI**.

You could also use it to generate code automatically, for clients that communicate with your API. For example, frontend, mobile or IoT applications.

### Deploy your app (optional) { #deploy-your-app-optional }

You can optionally deploy your FastAPI app to [FastAPI Cloud](https://fastapicloud.com), go and join the waiting list if you haven't. 🚀

If you already have a **FastAPI Cloud** account (we invited you from the waiting list 😉), you can deploy your application with one command.

Before deploying, make sure you are logged in:

<div class="termy">

```console
$ fastapi login

You are logged in to FastAPI Cloud 🚀
```

</div>

Then deploy your app:

<div class="termy">

```console
$ fastapi deploy

Deploying to FastAPI Cloud...

✅ Deployment successful!

🐔 Ready the chicken! Your app is ready at https://myapp.fastapicloud.dev
```

</div>

That's it! Now you can access your app at that URL. ✨

## Recap, step by step { #recap-step-by-step }

### Step 1: import `FastAPI` { #step-1-import-fastapi }

{* ../../docs_src/first_steps/tutorial001_py310.py hl[1] *}

`FastAPI` is a Python class that provides all the functionality for your API.

/// note | Technical Details

`FastAPI` is a class that inherits directly from `Starlette`.

You can use all the [Starlette](https://www.starlette.dev/) functionality with `FastAPI` too.

///

### Step 2: create a `FastAPI` "instance" { #step-2-create-a-fastapi-instance }

{* ../../docs_src/first_steps/tutorial001_py310.py hl[3] *}

Here the `app` variable will be an "instance" of the class `FastAPI`.

This will be the main point of interaction to create all your API.

### Step 3: create a *path operation* { #step-3-create-a-path-operation }

#### Path { #path }

"Path" here refers to the last part of the URL starting from the first `/`.

So, in a URL like:

```
https://example.com/items/foo
```

...the path would be:

```
/items/foo
```

/// info

A "path" is also commonly called an "endpoint" or a "route".

///

While building an API, the "path" is the main way to separate "concerns" and "resources".

#### Operation { #operation }

"Operation" here refers to one of the HTTP "methods".

One of:

* `POST`
* `GET`
* `PUT`
* `DELETE`

...and the more exotic ones:

* `OPTIONS`
* `HEAD`
* `PATCH`
* `TRACE`

In the HTTP protocol, you can communicate to each path using one (or more) of these "methods".

---

When building APIs, you normally use these specific HTTP methods to perform a specific action.

Normally you use:

* `POST`: to create data.
* `GET`: to read data.
* `PUT`: to update data.
* `DELETE`: to delete data.

So, in OpenAPI, each of the HTTP methods is called an "operation".

We are going to call them "**operations**" too.

#### Define a *path operation decorator* { #define-a-path-operation-decorator }

{* ../../docs_src/first_steps/tutorial001_py310.py hl[6] *}

The `@app.get("/")` tells **FastAPI** that the function right below is in charge of handling requests that go to:

* the path `/`
* using a <dfn title="an HTTP GET method"><code>get</code> operation</dfn>

/// info | `@decorator` Info

That `@something` syntax in Python is called a "decorator".

You put it on top of a function. Like a pretty decorative hat (I guess that's where the term came from).

A "decorator" takes the function below and does something with it.

In our case, this decorator tells **FastAPI** that the function below corresponds to the **path** `/` with an **operation** `get`.

It is the "**path operation decorator**".

///

You can also use the other operations:

* `@app.post()`
* `@app.put()`
* `@app.delete()`

And the more exotic ones:

* `@app.options()`
* `@app.head()`
* `@app.patch()`
* `@app.trace()`

/// tip

You are free to use each operation (HTTP method) as you wish.

**FastAPI** doesn't enforce any specific meaning.

The information here is presented as a guideline, not a requirement.

For example, when using GraphQL you normally perform all the actions using only `POST` operations.

///

### Step 4: define the **path operation function** { #step-4-define-the-path-operation-function }

This is our "**path operation function**":

* **path**: is `/`.
* **operation**: is `get`.
* **function**: is the function below the "decorator" (below `@app.get("/")`).

{* ../../docs_src/first_steps/tutorial001_py310.py hl[7] *}

This is a Python function.

It will be called by **FastAPI** whenever it receives a request to the URL "`/`" using a `GET` operation.

In this case, it is an `async` function.

---

You could also define it as a normal function instead of `async def`:

{* ../../docs_src/first_steps/tutorial003_py310.py hl[7] *}

/// note

If you don't know the difference, check the [Async: *"In a hurry?"*](../async.md#in-a-hurry).

///

### Step 5: return the content { #step-5-return-the-content }

{* ../../docs_src/first_steps/tutorial001_py310.py hl[8] *}

You can return a `dict`, `list`, singular values as `str`, `int`, etc.

You can also return Pydantic models (you'll see more about that later).

There are many other objects and models that will be automatically converted to JSON (including ORMs, etc). Try using your favorite ones, it's highly probable that they are already supported.

### Step 6: Deploy it { #step-6-deploy-it }

Deploy your app to **[FastAPI Cloud](https://fastapicloud.com)** with one command: `fastapi deploy`. 🎉

#### About FastAPI Cloud { #about-fastapi-cloud }

**[FastAPI Cloud](https://fastapicloud.com)** is built by the same author and team behind **FastAPI**.

It streamlines the process of **building**, **deploying**, and **accessing** an API with minimal effort.

It brings the same **developer experience** of building apps with FastAPI to **deploying** them to the cloud. 🎉

FastAPI Cloud is the primary sponsor and funding provider for the *FastAPI and friends* open source projects. ✨

#### Deploy to other cloud providers { #deploy-to-other-cloud-providers }

FastAPI is open source and based on standards. You can deploy FastAPI apps to any cloud provider you choose.

Follow your cloud provider's guides to deploy FastAPI apps with them. 🤓

## Recap { #recap }

* Import `FastAPI`.
* Create an `app` instance.
* Write a **path operation decorator** using decorators like `@app.get("/")`.
* Define a **path operation function**; for example, `def root(): ...`.
* Run the development server using the command `fastapi dev`.
* Optionally deploy your app with `fastapi deploy`.


---


# Path Parameters { #path-parameters }

You can declare path "parameters" or "variables" with the same syntax used by Python format strings:

{* ../../docs_src/path_params/tutorial001_py310.py hl[6:7] *}

The value of the path parameter `item_id` will be passed to your function as the argument `item_id`.

So, if you run this example and go to [http://127.0.0.1:8000/items/foo](http://127.0.0.1:8000/items/foo), you will see a response of:

```JSON
{"item_id":"foo"}
```

## Path parameters with types { #path-parameters-with-types }

You can declare the type of a path parameter in the function, using standard Python type annotations:

{* ../../docs_src/path_params/tutorial002_py310.py hl[7] *}

In this case, `item_id` is declared to be an `int`.

/// check

This will give you editor support inside of your function, with error checks, completion, etc.

///

## Data <dfn title="also known as: serialization, parsing, marshalling">conversion</dfn> { #data-conversion }

If you run this example and open your browser at [http://127.0.0.1:8000/items/3](http://127.0.0.1:8000/items/3), you will see a response of:

```JSON
{"item_id":3}
```

/// check

Notice that the value your function received (and returned) is `3`, as a Python `int`, not a string `"3"`.

So, with that type declaration, **FastAPI** gives you automatic request <dfn title="converting the string that comes from an HTTP request into Python data">"parsing"</dfn>.

///

## Data validation { #data-validation }

But if you go to the browser at [http://127.0.0.1:8000/items/foo](http://127.0.0.1:8000/items/foo), you will see a nice HTTP error of:

```JSON
{
  "detail": [
    {
      "type": "int_parsing",
      "loc": [
        "path",
        "item_id"
      ],
      "msg": "Input should be a valid integer, unable to parse string as an integer",
      "input": "foo"
    }
  ]
}
```

because the path parameter `item_id` had a value of `"foo"`, which is not an `int`.

The same error would appear if you provided a `float` instead of an `int`, as in: [http://127.0.0.1:8000/items/4.2](http://127.0.0.1:8000/items/4.2)

/// check

So, with the same Python type declaration, **FastAPI** gives you data validation.

Notice that the error also clearly states exactly the point where the validation didn't pass.

This is incredibly helpful while developing and debugging code that interacts with your API.

///

## Documentation { #documentation }

And when you open your browser at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs), you will see an automatic, interactive, API documentation like:

<img src="/img/tutorial/path-params/image01.png">

/// check

Again, just with that same Python type declaration, **FastAPI** gives you automatic, interactive documentation (integrating Swagger UI).

Notice that the path parameter is declared to be an integer.

///

## Standards-based benefits, alternative documentation { #standards-based-benefits-alternative-documentation }

And because the generated schema is from the [OpenAPI](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.1.0.md) standard, there are many compatible tools.

Because of this, **FastAPI** itself provides an alternative API documentation (using ReDoc), which you can access at [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc):

<img src="/img/tutorial/path-params/image02.png">

The same way, there are many compatible tools. Including code generation tools for many languages.

## Pydantic { #pydantic }

All the data validation is performed under the hood by [Pydantic](https://docs.pydantic.dev/), so you get all the benefits from it. And you know you are in good hands.

You can use the same type declarations with `str`, `float`, `bool` and many other complex data types.

Several of these are explored in the next chapters of the tutorial.

## Order matters { #order-matters }

When creating *path operations*, you can find situations where you have a fixed path.

Like `/users/me`, let's say that it's to get data about the current user.

And then you can also have a path `/users/{user_id}` to get data about a specific user by some user ID.

Because *path operations* are evaluated in order, you need to make sure that the path for `/users/me` is declared before the one for `/users/{user_id}`:

{* ../../docs_src/path_params/tutorial003_py310.py hl[6,11] *}

Otherwise, the path for `/users/{user_id}` would match also for `/users/me`, "thinking" that it's receiving a parameter `user_id` with a value of `"me"`.

Similarly, you cannot redefine a path operation:

{* ../../docs_src/path_params/tutorial003b_py310.py hl[6,11] *}

The first one will always be used since the path matches first.

## Predefined values { #predefined-values }

If you have a *path operation* that receives a *path parameter*, but you want the possible valid *path parameter* values to be predefined, you can use a standard Python <abbr title="Enumeration">`Enum`</abbr>.

### Create an `Enum` class { #create-an-enum-class }

Import `Enum` and create a sub-class that inherits from `str` and from `Enum`.

By inheriting from `str` the API docs will be able to know that the values must be of type `string` and will be able to render correctly.

Then create class attributes with fixed values, which will be the available valid values:

{* ../../docs_src/path_params/tutorial005_py310.py hl[1,6:9] *}

/// tip

If you are wondering, "AlexNet", "ResNet", and "LeNet" are just names of Machine Learning <dfn title="Technically, Deep Learning model architectures">models</dfn>.

///

### Declare a *path parameter* { #declare-a-path-parameter }

Then create a *path parameter* with a type annotation using the enum class you created (`ModelName`):

{* ../../docs_src/path_params/tutorial005_py310.py hl[16] *}

### Check the docs { #check-the-docs }

Because the available values for the *path parameter* are predefined, the interactive docs can show them nicely:

<img src="/img/tutorial/path-params/image03.png">

### Working with Python *enumerations* { #working-with-python-enumerations }

The value of the *path parameter* will be an *enumeration member*.

#### Compare *enumeration members* { #compare-enumeration-members }

You can compare it with the *enumeration member* in your created enum `ModelName`:

{* ../../docs_src/path_params/tutorial005_py310.py hl[17] *}

#### Get the *enumeration value* { #get-the-enumeration-value }

You can get the actual value (a `str` in this case) using `model_name.value`, or in general, `your_enum_member.value`:

{* ../../docs_src/path_params/tutorial005_py310.py hl[20] *}

/// tip

You could also access the value `"lenet"` with `ModelName.lenet.value`.

///

#### Return *enumeration members* { #return-enumeration-members }

You can return *enum members* from your *path operation*, even nested in a JSON body (e.g. a `dict`).

They will be converted to their corresponding values (strings in this case) before returning them to the client:

{* ../../docs_src/path_params/tutorial005_py310.py hl[18,21,23] *}

In your client you will get a JSON response like:

```JSON
{
  "model_name": "alexnet",
  "message": "Deep Learning FTW!"
}
```

## Path parameters containing paths { #path-parameters-containing-paths }

Let's say you have a *path operation* with a path `/files/{file_path}`.

But you need `file_path` itself to contain a *path*, like `home/johndoe/myfile.txt`.

So, the URL for that file would be something like: `/files/home/johndoe/myfile.txt`.

### OpenAPI support { #openapi-support }

OpenAPI doesn't support a way to declare a *path parameter* to contain a *path* inside, as that could lead to scenarios that are difficult to test and define.

Nevertheless, you can still do it in **FastAPI**, using one of the internal tools from Starlette.

And the docs would still work, although not adding any documentation telling that the parameter should contain a path.

### Path convertor { #path-convertor }

Using an option directly from Starlette you can declare a *path parameter* containing a *path* using a URL like:

```
/files/{file_path:path}
```

In this case, the name of the parameter is `file_path`, and the last part, `:path`, tells it that the parameter should match any *path*.

So, you can use it with:

{* ../../docs_src/path_params/tutorial004_py310.py hl[6] *}

/// tip

You might need the parameter to contain `/home/johndoe/myfile.txt`, with a leading slash (`/`).

In that case, the URL would be: `/files//home/johndoe/myfile.txt`, with a double slash (`//`) between `files` and `home`.

///

## Recap { #recap }

With **FastAPI**, by using short, intuitive and standard Python type declarations, you get:

* Editor support: error checks, autocompletion, etc.
* Data "<dfn title="converting the string that comes from an HTTP request into Python data">parsing</dfn>"
* Data validation
* API annotation and automatic documentation

And you only have to declare them once.

That's probably the main visible advantage of **FastAPI** compared to alternative frameworks (apart from the raw performance).


---


# Query Parameters { #query-parameters }

When you declare other function parameters that are not part of the path parameters, they are automatically interpreted as "query" parameters.

{* ../../docs_src/query_params/tutorial001_py310.py hl[9] *}

The query is the set of key-value pairs that go after the `?` in a URL, separated by `&` characters.

For example, in the URL:

```
http://127.0.0.1:8000/items/?skip=0&limit=10
```

...the query parameters are:

* `skip`: with a value of `0`
* `limit`: with a value of `10`

As they are part of the URL, they are "naturally" strings.

But when you declare them with Python types (in the example above, as `int`), they are converted to that type and validated against it.

All the same process that applied for path parameters also applies for query parameters:

* Editor support (obviously)
* Data <dfn title="converting the string that comes from an HTTP request into Python data">"parsing"</dfn>
* Data validation
* Automatic documentation

## Defaults { #defaults }

As query parameters are not a fixed part of a path, they can be optional and can have default values.

In the example above they have default values of `skip=0` and `limit=10`.

So, going to the URL:

```
http://127.0.0.1:8000/items/
```

would be the same as going to:

```
http://127.0.0.1:8000/items/?skip=0&limit=10
```

But if you go to, for example:

```
http://127.0.0.1:8000/items/?skip=20
```

The parameter values in your function will be:

* `skip=20`: because you set it in the URL
* `limit=10`: because that was the default value

## Optional parameters { #optional-parameters }

The same way, you can declare optional query parameters, by setting their default to `None`:

{* ../../docs_src/query_params/tutorial002_py310.py hl[7] *}

In this case, the function parameter `q` will be optional, and will be `None` by default.

/// check

Also notice that **FastAPI** is smart enough to notice that the path parameter `item_id` is a path parameter and `q` is not, so, it's a query parameter.

///

## Query parameter type conversion { #query-parameter-type-conversion }

You can also declare `bool` types, and they will be converted:

{* ../../docs_src/query_params/tutorial003_py310.py hl[7] *}

In this case, if you go to:

```
http://127.0.0.1:8000/items/foo?short=1
```

or

```
http://127.0.0.1:8000/items/foo?short=True
```

or

```
http://127.0.0.1:8000/items/foo?short=true
```

or

```
http://127.0.0.1:8000/items/foo?short=on
```

or

```
http://127.0.0.1:8000/items/foo?short=yes
```

or any other case variation (uppercase, first letter in uppercase, etc), your function will see the parameter `short` with a `bool` value of `True`. Otherwise as `False`.


## Multiple path and query parameters { #multiple-path-and-query-parameters }

You can declare multiple path parameters and query parameters at the same time, **FastAPI** knows which is which.

And you don't have to declare them in any specific order.

They will be detected by name:

{* ../../docs_src/query_params/tutorial004_py310.py hl[6,8] *}

## Required query parameters { #required-query-parameters }

When you declare a default value for non-path parameters (for now, we have only seen query parameters), then it is not required.

If you don't want to add a specific value but just make it optional, set the default as `None`.

But when you want to make a query parameter required, you can just not declare any default value:

{* ../../docs_src/query_params/tutorial005_py310.py hl[6:7] *}

Here the query parameter `needy` is a required query parameter of type `str`.

If you open in your browser a URL like:

```
http://127.0.0.1:8000/items/foo-item
```

...without adding the required parameter `needy`, you will see an error like:

```JSON
{
  "detail": [
    {
      "type": "missing",
      "loc": [
        "query",
        "needy"
      ],
      "msg": "Field required",
      "input": null
    }
  ]
}
```

As `needy` is a required parameter, you would need to set it in the URL:

```
http://127.0.0.1:8000/items/foo-item?needy=sooooneedy
```

...this would work:

```JSON
{
    "item_id": "foo-item",
    "needy": "sooooneedy"
}
```

And of course, you can define some parameters as required, some as having a default value, and some entirely optional:

{* ../../docs_src/query_params/tutorial006_py310.py hl[8] *}

In this case, there are 3 query parameters:

* `needy`, a required `str`.
* `skip`, an `int` with a default value of `0`.
* `limit`, an optional `int`.

/// tip

You could also use `Enum`s the same way as with [Path Parameters](path-params.md#predefined-values).

///


---


# Request Body { #request-body }

When you need to send data from a client (let's say, a browser) to your API, you send it as a **request body**.

A **request** body is data sent by the client to your API. A **response** body is the data your API sends to the client.

Your API almost always has to send a **response** body. But clients don't necessarily need to send **request bodies** all the time, sometimes they only request a path, maybe with some query parameters, but don't send a body.

To declare a **request** body, you use [Pydantic](https://docs.pydantic.dev/) models with all their power and benefits.

/// info

To send data, you should use one of: `POST` (the more common), `PUT`, `DELETE` or `PATCH`.

Sending a body with a `GET` request has an undefined behavior in the specifications, nevertheless, it is supported by FastAPI, only for very complex/extreme use cases.

As it is discouraged, the interactive docs with Swagger UI won't show the documentation for the body when using `GET`, and proxies in the middle might not support it.

///

## Import Pydantic's `BaseModel` { #import-pydantics-basemodel }

First, you need to import `BaseModel` from `pydantic`:

{* ../../docs_src/body/tutorial001_py310.py hl[2] *}

## Create your data model { #create-your-data-model }

Then you declare your data model as a class that inherits from `BaseModel`.

Use standard Python types for all the attributes:

{* ../../docs_src/body/tutorial001_py310.py hl[5:9] *}


The same as when declaring query parameters, when a model attribute has a default value, it is not required. Otherwise, it is required. Use `None` to make it just optional.

For example, this model above declares a JSON "`object`" (or Python `dict`) like:

```JSON
{
    "name": "Foo",
    "description": "An optional description",
    "price": 45.2,
    "tax": 3.5
}
```

...as `description` and `tax` are optional (with a default value of `None`), this JSON "`object`" would also be valid:

```JSON
{
    "name": "Foo",
    "price": 45.2
}
```

## Declare it as a parameter { #declare-it-as-a-parameter }

To add it to your *path operation*, declare it the same way you declared path and query parameters:

{* ../../docs_src/body/tutorial001_py310.py hl[16] *}

...and declare its type as the model you created, `Item`.

## Results { #results }

With just that Python type declaration, **FastAPI** will:

* Read the body of the request as JSON.
* Convert the corresponding types (if needed).
* Validate the data.
    * If the data is invalid, it will return a nice and clear error, indicating exactly where and what was the incorrect data.
* Give you the received data in the parameter `item`.
    * As you declared it in the function to be of type `Item`, you will also have all the editor support (completion, etc) for all of the attributes and their types.
* Generate [JSON Schema](https://json-schema.org) definitions for your model, you can also use them anywhere else you like if it makes sense for your project.
* Those schemas will be part of the generated OpenAPI schema, and used by the automatic documentation <abbr title="User Interfaces">UIs</abbr>.

## Automatic docs { #automatic-docs }

The JSON Schemas of your models will be part of your OpenAPI generated schema, and will be shown in the interactive API docs:

<img src="/img/tutorial/body/image01.png">

And will also be used in the API docs inside each *path operation* that needs them:

<img src="/img/tutorial/body/image02.png">

## Editor support { #editor-support }

In your editor, inside your function you will get type hints and completion everywhere (this wouldn't happen if you received a `dict` instead of a Pydantic model):

<img src="/img/tutorial/body/image03.png">

You also get error checks for incorrect type operations:

<img src="/img/tutorial/body/image04.png">

This is not by chance, the whole framework was built around that design.

And it was thoroughly tested at the design phase, before any implementation, to ensure it would work with all the editors.

There were even some changes to Pydantic itself to support this.

The previous screenshots were taken with [Visual Studio Code](https://code.visualstudio.com).

But you would get the same editor support with [PyCharm](https://www.jetbrains.com/pycharm/) and most of the other Python editors:

<img src="/img/tutorial/body/image05.png">

/// tip

If you use [PyCharm](https://www.jetbrains.com/pycharm/) as your editor, you can use the [Pydantic PyCharm Plugin](https://github.com/koxudaxi/pydantic-pycharm-plugin/).

It improves editor support for Pydantic models, with:

* auto-completion
* type checks
* refactoring
* searching
* inspections

///

## Use the model { #use-the-model }

Inside of the function, you can access all the attributes of the model object directly:

{* ../../docs_src/body/tutorial002_py310.py *}

## Request body + path parameters { #request-body-path-parameters }

You can declare path parameters and request body at the same time.

**FastAPI** will recognize that the function parameters that match path parameters should be **taken from the path**, and that function parameters that are declared to be Pydantic models should be **taken from the request body**.

{* ../../docs_src/body/tutorial003_py310.py hl[15:16] *}


## Request body + path + query parameters { #request-body-path-query-parameters }

You can also declare **body**, **path** and **query** parameters, all at the same time.

**FastAPI** will recognize each of them and take the data from the correct place.

{* ../../docs_src/body/tutorial004_py310.py hl[16] *}

The function parameters will be recognized as follows:

* If the parameter is also declared in the **path**, it will be used as a path parameter.
* If the parameter is of a **singular type** (like `int`, `float`, `str`, `bool`, etc) it will be interpreted as a **query** parameter.
* If the parameter is declared to be of the type of a **Pydantic model**, it will be interpreted as a request **body**.

/// note

FastAPI will know that the value of `q` is not required because of the default value `= None`.

The `str | None` is not used by FastAPI to determine that the value is not required, it will know it's not required because it has a default value of `= None`.

But adding the type annotations will allow your editor to give you better support and detect errors.

///

## Without Pydantic { #without-pydantic }

If you don't want to use Pydantic models, you can also use **Body** parameters. See the docs for [Body - Multiple Parameters: Singular values in body](body-multiple-params.md#singular-values-in-body).


---


# Response Model - Return Type { #response-model-return-type }

You can declare the type used for the response by annotating the *path operation function* **return type**.

You can use **type annotations** the same way you would for input data in function **parameters**, you can use Pydantic models, lists, dictionaries, scalar values like integers, booleans, etc.

{* ../../docs_src/response_model/tutorial001_01_py310.py hl[16,21] *}

FastAPI will use this return type to:

* **Validate** the returned data.
    * If the data is invalid (e.g. you are missing a field), it means that *your* app code is broken, not returning what it should, and it will return a server error instead of returning incorrect data. This way you and your clients can be certain that they will receive the data and the data shape expected.
* Add a **JSON Schema** for the response, in the OpenAPI *path operation*.
    * This will be used by the **automatic docs**.
    * It will also be used by automatic client code generation tools.
* **Serialize** the returned data to JSON using Pydantic, which is written in **Rust**, so it will be **much faster**.

But most importantly:

* It will **limit and filter** the output data to what is defined in the return type.
    * This is particularly important for **security**, we'll see more of that below.

## `response_model` Parameter { #response-model-parameter }

There are some cases where you need or want to return some data that is not exactly what the type declares.

For example, you could want to **return a dictionary** or a database object, but **declare it as a Pydantic model**. This way the Pydantic model would do all the data documentation, validation, etc. for the object that you returned (e.g. a dictionary or database object).

If you added the return type annotation, tools and editors would complain with a (correct) error telling you that your function is returning a type (e.g. a dict) that is different from what you declared (e.g. a Pydantic model).

In those cases, you can use the *path operation decorator* parameter `response_model` instead of the return type.

You can use the `response_model` parameter in any of the *path operations*:

* `@app.get()`
* `@app.post()`
* `@app.put()`
* `@app.delete()`
* etc.

{* ../../docs_src/response_model/tutorial001_py310.py hl[17,22,24:27] *}

/// note

Notice that `response_model` is a parameter of the "decorator" method (`get`, `post`, etc). Not of your *path operation function*, like all the parameters and body.

///

`response_model` receives the same type you would declare for a Pydantic model field, so, it can be a Pydantic model, but it can also be, e.g. a `list` of Pydantic models, like `List[Item]`.

FastAPI will use this `response_model` to do all the data documentation, validation, etc. and also to **convert and filter the output data** to its type declaration.

/// tip

If you have strict type checks in your editor, mypy, etc, you can declare the function return type as `Any`.

That way you tell the editor that you are intentionally returning anything. But FastAPI will still do the data documentation, validation, filtering, etc. with the `response_model`.

///

### `response_model` Priority { #response-model-priority }

If you declare both a return type and a `response_model`, the `response_model` will take priority and be used by FastAPI.

This way you can add correct type annotations to your functions even when you are returning a type different than the response model, to be used by the editor and tools like mypy. And still you can have FastAPI do the data validation, documentation, etc. using the `response_model`.

You can also use `response_model=None` to disable creating a response model for that *path operation*, you might need to do it if you are adding type annotations for things that are not valid Pydantic fields, you will see an example of that in one of the sections below.

## Return the same input data { #return-the-same-input-data }

Here we are declaring a `UserIn` model, it will contain a plaintext password:

{* ../../docs_src/response_model/tutorial002_py310.py hl[7,9] *}

/// info

To use `EmailStr`, first install [`email-validator`](https://github.com/JoshData/python-email-validator).

Make sure you create a [virtual environment](../virtual-environments.md), activate it, and then install it, for example:

```console
$ pip install email-validator
```

or with:

```console
$ pip install "pydantic[email]"
```

///

And we are using this model to declare our input and the same model to declare our output:

{* ../../docs_src/response_model/tutorial002_py310.py hl[16] *}

Now, whenever a browser is creating a user with a password, the API will return the same password in the response.

In this case, it might not be a problem, because it's the same user sending the password.

But if we use the same model for another *path operation*, we could be sending our user's passwords to every client.

/// danger

Never store the plain password of a user or send it in a response like this, unless you know all the caveats and you know what you are doing.

///

## Add an output model { #add-an-output-model }

We can instead create an input model with the plaintext password and an output model without it:

{* ../../docs_src/response_model/tutorial003_py310.py hl[9,11,16] *}

Here, even though our *path operation function* is returning the same input user that contains the password:

{* ../../docs_src/response_model/tutorial003_py310.py hl[24] *}

...we declared the `response_model` to be our model `UserOut`, that doesn't include the password:

{* ../../docs_src/response_model/tutorial003_py310.py hl[22] *}

So, **FastAPI** will take care of filtering out all the data that is not declared in the output model (using Pydantic).

### `response_model` or Return Type { #response-model-or-return-type }

In this case, because the two models are different, if we annotated the function return type as `UserOut`, the editor and tools would complain that we are returning an invalid type, as those are different classes.

That's why in this example we have to declare it in the `response_model` parameter.

...but continue reading below to see how to overcome that.

## Return Type and Data Filtering { #return-type-and-data-filtering }

Let's continue from the previous example. We wanted to **annotate the function with one type**, but we wanted to be able to return from the function something that actually includes **more data**.

We want FastAPI to keep **filtering** the data using the response model. So that even though the function returns more data, the response will only include the fields declared in the response model.

In the previous example, because the classes were different, we had to use the `response_model` parameter. But that also means that we don't get the support from the editor and tools checking the function return type.

But in most of the cases where we need to do something like this, we want the model just to **filter/remove** some of the data as in this example.

And in those cases, we can use classes and inheritance to take advantage of function **type annotations** to get better support in the editor and tools, and still get the FastAPI **data filtering**.

{* ../../docs_src/response_model/tutorial003_01_py310.py hl[7:10,13:14,18] *}

With this, we get tooling support, from editors and mypy as this code is correct in terms of types, but we also get the data filtering from FastAPI.

How does this work? Let's check that out. 🤓

### Type Annotations and Tooling { #type-annotations-and-tooling }

First let's see how editors, mypy and other tools would see this.

`BaseUser` has the base fields. Then `UserIn` inherits from `BaseUser` and adds the `password` field, so, it will include all the fields from both models.

We annotate the function return type as `BaseUser`, but we are actually returning a `UserIn` instance.

The editor, mypy, and other tools won't complain about this because, in typing terms, `UserIn` is a subclass of `BaseUser`, which means it's a *valid* type when what is expected is anything that is a `BaseUser`.

### FastAPI Data Filtering { #fastapi-data-filtering }

Now, for FastAPI, it will see the return type and make sure that what you return includes **only** the fields that are declared in the type.

FastAPI does several things internally with Pydantic to make sure that those same rules of class inheritance are not used for the returned data filtering, otherwise you could end up returning much more data than what you expected.

This way, you can get the best of both worlds: type annotations with **tooling support** and **data filtering**.

## See it in the docs { #see-it-in-the-docs }

When you see the automatic docs, you can check that the input model and output model will both have their own JSON Schema:

<img src="/img/tutorial/response-model/image01.png">

And both models will be used for the interactive API documentation:

<img src="/img/tutorial/response-model/image02.png">

## Other Return Type Annotations { #other-return-type-annotations }

There might be cases where you return something that is not a valid Pydantic field and you annotate it in the function, only to get the support provided by tooling (the editor, mypy, etc).

### Return a Response Directly { #return-a-response-directly }

The most common case would be [returning a Response directly as explained later in the advanced docs](../advanced/response-directly.md).

{* ../../docs_src/response_model/tutorial003_02_py310.py hl[8,10:11] *}

This simple case is handled automatically by FastAPI because the return type annotation is the class (or a subclass of) `Response`.

And tools will also be happy because both `RedirectResponse` and `JSONResponse` are subclasses of `Response`, so the type annotation is correct.

### Annotate a Response Subclass { #annotate-a-response-subclass }

You can also use a subclass of `Response` in the type annotation:

{* ../../docs_src/response_model/tutorial003_03_py310.py hl[8:9] *}

This will also work because `RedirectResponse` is a subclass of `Response`, and FastAPI will automatically handle this simple case.

### Invalid Return Type Annotations { #invalid-return-type-annotations }

But when you return some other arbitrary object that is not a valid Pydantic type (e.g. a database object) and you annotate it like that in the function, FastAPI will try to create a Pydantic response model from that type annotation, and will fail.

The same would happen if you had something like a <dfn title='A union between multiple types means "any of these types".'>union</dfn> between different types where one or more of them are not valid Pydantic types, for example this would fail 💥:

{* ../../docs_src/response_model/tutorial003_04_py310.py hl[8] *}

...this fails because the type annotation is not a Pydantic type and is not just a single `Response` class or subclass, it's a union (any of the two) between a `Response` and a `dict`.

### Disable Response Model { #disable-response-model }

Continuing from the example above, you might not want to have the default data validation, documentation, filtering, etc. that is performed by FastAPI.

But you might want to still keep the return type annotation in the function to get the support from tools like editors and type checkers (e.g. mypy).

In this case, you can disable the response model generation by setting `response_model=None`:

{* ../../docs_src/response_model/tutorial003_05_py310.py hl[7] *}

This will make FastAPI skip the response model generation and that way you can have any return type annotations you need without it affecting your FastAPI application. 🤓

## Response Model encoding parameters { #response-model-encoding-parameters }

Your response model could have default values, like:

{* ../../docs_src/response_model/tutorial004_py310.py hl[9,11:12] *}

* `description: Union[str, None] = None` (or `str | None = None` in Python 3.10) has a default of `None`.
* `tax: float = 10.5` has a default of `10.5`.
* `tags: List[str] = []` has a default of an empty list: `[]`.

but you might want to omit them from the result if they were not actually stored.

For example, if you have models with many optional attributes in a NoSQL database, but you don't want to send very long JSON responses full of default values.

### Use the `response_model_exclude_unset` parameter { #use-the-response-model-exclude-unset-parameter }

You can set the *path operation decorator* parameter `response_model_exclude_unset=True`:

{* ../../docs_src/response_model/tutorial004_py310.py hl[22] *}

and those default values won't be included in the response, only the values actually set.

So, if you send a request to that *path operation* for the item with ID `foo`, the response (not including default values) will be:

```JSON
{
    "name": "Foo",
    "price": 50.2
}
```

/// info

You can also use:

* `response_model_exclude_defaults=True`
* `response_model_exclude_none=True`

as described in [the Pydantic docs](https://docs.pydantic.dev/1.10/usage/exporting_models/#modeldict) for `exclude_defaults` and `exclude_none`.

///

#### Data with values for fields with defaults { #data-with-values-for-fields-with-defaults }

But if your data has values for the model's fields with default values, like the item with ID `bar`:

```Python hl_lines="3  5"
{
    "name": "Bar",
    "description": "The bartenders",
    "price": 62,
    "tax": 20.2
}
```

they will be included in the response.

#### Data with the same values as the defaults { #data-with-the-same-values-as-the-defaults }

If the data has the same values as the default ones, like the item with ID `baz`:

```Python hl_lines="3  5-6"
{
    "name": "Baz",
    "description": None,
    "price": 50.2,
    "tax": 10.5,
    "tags": []
}
```

FastAPI is smart enough (actually, Pydantic is smart enough) to realize that, even though `description`, `tax`, and `tags` have the same values as the defaults, they were set explicitly (instead of taken from the defaults).

So, they will be included in the JSON response.

/// tip

Notice that the default values can be anything, not only `None`.

They can be a list (`[]`), a `float` of `10.5`, etc.

///

### `response_model_include` and `response_model_exclude` { #response-model-include-and-response-model-exclude }

You can also use the *path operation decorator* parameters `response_model_include` and `response_model_exclude`.

They take a `set` of `str` with the name of the attributes to include (omitting the rest) or to exclude (including the rest).

This can be used as a quick shortcut if you have only one Pydantic model and want to remove some data from the output.

/// tip

But it is still recommended to use the ideas above, using multiple classes, instead of these parameters.

This is because the JSON Schema generated in your app's OpenAPI (and the docs) will still be the one for the complete model, even if you use `response_model_include` or `response_model_exclude` to omit some attributes.

This also applies to `response_model_by_alias` that works similarly.

///

{* ../../docs_src/response_model/tutorial005_py310.py hl[29,35] *}

/// tip

The syntax `{"name", "description"}` creates a `set` with those two values.

It is equivalent to `set(["name", "description"])`.

///

#### Using `list`s instead of `set`s { #using-lists-instead-of-sets }

If you forget to use a `set` and use a `list` or `tuple` instead, FastAPI will still convert it to a `set` and it will work correctly:

{* ../../docs_src/response_model/tutorial006_py310.py hl[29,35] *}

## Recap { #recap }

Use the *path operation decorator's* parameter `response_model` to define response models and especially to ensure private data is filtered out.

Use `response_model_exclude_unset` to return only the values explicitly set.


---


404: Not Found

---


404: Not Found

---


