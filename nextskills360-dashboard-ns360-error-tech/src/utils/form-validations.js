// Regular expression to test if the provided name string contains only alphabets and space.
export const isValidName = (name) => new RegExp(/^[a-zA-Z ]*$/).test(name);

// Regular expression to test if the provided mobile number contains digits only.
export const isValidMobileNumber = (mobileNumber) => new RegExp(/^[0-9]{1,10}$/).test(mobileNumber);
