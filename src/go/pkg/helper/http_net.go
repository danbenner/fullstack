package helper

import (
	"bytes"
	"encoding/json"
	"errors"
	"io"
	"io/ioutil"
	"net/http"
	"net/url"
)

// GetSingleFormValue ... accepts only 1 key
func GetSingleFormValue(r *http.Request, key string) (formValue string, err error) {
	if err := r.ParseForm(); err != nil {
		return "", err
	}
	formValue = r.FormValue(key)
	if formValue == "" {
		return "", errors.New("Form Value empty")
	}
	return formValue, nil
}

// GetFormValues ... accepts Multiple keys
func GetFormValues(r *http.Request, keys ...string) ([]string, error) {
	// ParseForm() populates the request.Form prior to using FormValue()
	if err := r.ParseForm(); err != nil {
		return nil, err
	}
	arrayOfValues := make([]string, len(keys))
	for i, j := range keys {
		arrayOfValues[i] = r.FormValue(j)
	}
	if len(arrayOfValues) != 0 {
		if arrayOfValues[0] == "" {
			return nil, errors.New("Form Values Empty")
		}
	}
	return arrayOfValues, nil
}

// SetURLValues ... accepts {key:value} pairs
func SetURLValues(dict map[string]string) url.Values {
	data := url.Values{}
	for key := range dict {
		data.Set(key, dict[key])
	}
	return data
}

// CreateHTTPRequest ...
func CreateHTTPRequest(method string, url string, buf *bytes.Buffer) *http.Request {
	req, err := http.NewRequest(method, url, buf)
	if err != nil {
		return nil
	}
	return req
}

// UnmarshallHTTPResponseBody ...
func UnmarshallHTTPResponseBody(body io.ReadCloser) (map[string]string, error) {
	b, err := ioutil.ReadAll(body)
	if err != nil {
		return nil, err
	}
	var unmarshalledResponse map[string]string
	if err := json.Unmarshal(b, &unmarshalledResponse); err != nil {
		return nil, err
	}
	return unmarshalledResponse, nil
}
