// Phone number validation
export const validatePhoneNumber = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/\D/g, ""));
};

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Generate OTP (6 digits)
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Validate OTP
export const validateOTP = (enteredOTP, generatedOTP) => {
  return enteredOTP === generatedOTP;
};

// Phone number verification via OTP
export const sendOTP = async (phoneNumber) => {
  try {
    // Call your backend API to send OTP
    const response = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error sending OTP:", error);
    return { success: false, message: "Failed to send OTP" };
  }
};

// Verify OTP
export const verifyOTP = async (phoneNumber, otp) => {
  try {
    const response = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber, otp }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return { success: false, message: "Failed to verify OTP" };
  }
};

// Validate all form fields
export const validateFormData = (formData) => {
  const errors = {};

  // Personal Details Validation
  if (!formData.firstName.trim()) errors.firstName = "First Name is required";
  if (!formData.lastName.trim()) errors.lastName = "Last Name is required";
  if (!formData.email.trim()) {
    errors.email = "Email is required";
  } else if (!validateEmail(formData.email)) {
    errors.email = "Invalid email format";
  }
  if (formData.altEmail && !validateEmail(formData.altEmail)) {
    errors.altEmail = "Invalid alternate email format";
  }

  // Phone validation
  if (!formData.mobile.trim()) {
    errors.mobile = "Mobile Number is required";
  } else if (!validatePhoneNumber(formData.mobile)) {
    errors.mobile = "Mobile number must be 10 digits";
  }
  if (formData.altMobile && !validatePhoneNumber(formData.altMobile)) {
    errors.altMobile = "Alternate mobile must be 10 digits";
  }

  if (!formData.dob) errors.dob = "Date of Birth is required";
  if (!formData.gender) errors.gender = "Gender is required";

  // Address Validation
  if (!formData.address.trim()) errors.address = "Address is required";
  if (!formData.pincode.trim()) errors.pincode = "Pincode is required";
  if (!/^\d{6}$/.test(formData.pincode)) errors.pincode = "Pincode must be 6 digits";
  if (!formData.city.trim()) errors.city = "City is required";
  if (!formData.state.trim()) errors.state = "State is required";
  if (!formData.country.trim()) errors.country = "Country is required";

  // Education Validation
  formData.educationList.forEach((edu, index) => {
    if (!edu.educationType) errors[`education_${index}_type`] = "Education type required";
    if (!edu.course.trim()) errors[`education_${index}_course`] = "Course is required";
    if (!edu.college.trim()) errors[`education_${index}_college`] = "College name is required";
    if (!edu.score.trim()) errors[`education_${index}_score`] = "Score/CGPA is required";
    if (!edu.universityRegNo.trim()) errors[`education_${index}_regNo`] = "Roll number is required";
  });

  // Certification Validation
  if (formData.professionalCert === "Yes") {
    if (!formData.certName.trim()) errors.certName = "Certificate Name is required";
    if (!formData.proficiency) errors.proficiency = "Proficiency is required";
    if (!formData.certNumber.trim()) errors.certNumber = "Certificate Number is required";
    if (!formData.issueDate) errors.issueDate = "Issue Date is required";
  }

  if (!formData.terms) errors.terms = "You must accept Terms & Conditions";

  return errors;
};