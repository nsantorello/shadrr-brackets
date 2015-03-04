# Shadrr HTTP Spec
The following document outlines the spec for communicating with Shadrr clients over HTTP.  All web requests are `POST` using `x-www-form-urlencoded`.


---

### `/shader`
Sets the list of files shown in the application
#### Parameters
* `filename` - the filename of the shader being edited
* `code` - the shader code for the file

#### Example
`curl -v --data-urlencode "filename=shader1.glsl&code=..." http://url:port`

---
