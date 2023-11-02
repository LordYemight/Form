// Give a responsive form design for this my from project 
import React, { useState } from 'react';
import json from '../assets/configurable_forms.json';
import '../App.css'

const Form = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [formData, setFormData] = useState({
    document_options: 'None selected',
  });
  const totalPages = json.pages.length;

  // handle cancel pop up 
  const [isCancelConfirmationVisible, setCancelConfirmationVisible] = useState(false);
  // handle submit poop up
  const [isSubmitConfirmationVisible, setSubmitConfirmationVisible] = useState(false);
  // handle drop-down
  const [isDropdownOpen, setDropdownOpen] = useState(false);


  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prevPage) => prevPage + 1);
    }

  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    (currentPage < totalPages - 1) ? handleNext() :
      setSubmitConfirmationVisible(true);
  };
  const handleSubmitConfirmation = (confirm) => {
    // Hide the cancel confirmation dialog
    setSubmitConfirmationVisible(false);
    if (confirm) {
      // If confirmed, reset the form data
      setFormData({
        document_options: 'Select an option',
      });
      // Save the form data to local storage
      localStorage.setItem('formData', JSON.stringify(formData));
      // Reset the form to the first page
      setCurrentPage(0);

    }
  };

  const handleFieldChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };
  const handleDropdownChange = (value) => {
    setFormData({ ...formData, document_options: value });
    setDropdownOpen(false);
  };
  const handleCancel = () => {
    // Show the cancel confirmation dialog
    setCancelConfirmationVisible(true);
  };
  const handleCancelConfirmation = (confirm) => {
    // Hide the cancel confirmation dialog
    setCancelConfirmationVisible(false);
    if (confirm) {
      // If confirmed, reset the form data
      setFormData({
        document_options: 'Select an option',
      });
      // Reset the form to the first page
      setCurrentPage(0);
      setFormData('')
    }
  };

  // Calculate the current date in the YYYY-MM-DD format
  const today = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }


  const page = json.pages[currentPage];


  return (
    <div className='Form'>
      <div className='header'>
        <h1 className='title'>{json.meta.name}</h1>
        <p className='descrip'>{json.meta.Description}</p>
      </div>
      <div className='page-info'>
        <h1 className='page-title'>{page.title}</h1>
        <p className='page-description' >{page.description}</p>
      </div>
      <form onSubmit={handleSubmit}>
        {page.sections.map((section) => (
          <div key={section.name}>
            <h2>{section.name}</h2>
            <p className='student-details'>{section.description}</p>
            {section.fields.map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id}>
                  {field.validation.required === true ? <p className="required">*</p> : <></>}
                  {field.label}
                </label>
                <p className='description'>{field.description}</p>
                {field.type === "short_text" && (
                  <>
                    <input
                      type={field.type}
                      id={field.id}
                      value={formData[field.id] || ""}
                      onChange={handleFieldChange}
                      required={field.validation.required}
                      minLength={field.validation.minimum_length}
                      maxLength={field.validation.maximum_length}
                    />
                  </>
                )}
                {field.type === "long_text" && (
                  <>
                    <input
                      id={field.id}
                      type={field.type}
                      value={formData[field.id] || ""}
                      onChange={handleFieldChange}
                      required={field.validation.required}
                      minLength={field.validation.minimum_length}
                      maxLength={field.validation.maximum_length}
                      rows={field.validation.number_of_lines}

                    />
                  </>
                )}
                {field.type === "date" && (
                  <>
                    <input
                      type={field.type}
                      id={field.id}
                      value={formData[field.id] || ""}
                      onChange={handleFieldChange}
                      required={field.validation.required}
                      min="1924-10-13"
                      max={today()}

                    />

                  </>
                )}
                {field.type === "integer" && (
                  <>
                    <input
                      type='number'
                      id={field.id}
                      value={formData[field.id] || ""}
                      onChange={handleFieldChange}
                      required={field.validation.required}
                      min={field.validation.minimum}
                      max={field.validation.maximum}
                      minLength={field.validation.minimum_length}
                      maxLength={field.validation.maximum_length}
                    />
                  </>
                )}
                {field.type === "email" && (
                  <>
                    <input
                      type={field.type}
                      id={field.id}
                      value={formData[field.id] || ""}
                      onChange={handleFieldChange}
                      required={field.validation.required}
                    />
                  </>
                )}
                {field.type === "checkbox" && (
                  <div>
                    {field.options.map((option) => (
                      <label key={option.id} className='food'>
                        <>
                          <input
                            type={field.type}
                            id={field.id}
                            value={option.value}
                            onChange={handleFieldChange}
                            required={field.validation.required}
                          />
                        </>
                        {option.label}
                      </label>
                    ))}
                  </div>
                )}
                {field.type === "radio" && (
                  <div>
                    {field.options.map((option) => (
                      <label key={option.id} className='food'>
                        <>
                          <input
                            type={field.type}
                            id={field.id}
                            value={option.value}
                            onChange={handleFieldChange}
                            required={field.validation.required}
                            min={field.validation.minimum_select}
                          />
                        </>
                        {option.label}
                      </label>
                    ))}
                  </div>
                )}
                {field.type === "dropdown" && (
                  <div className="dropdown-container">
                    <div
                      className={`custom-dropdown ${isDropdownOpen ? 'open' : ''}`}
                      onClick={() => setDropdownOpen(!isDropdownOpen)}
                    >
                      <div className="selected-value">{formData.document_options}</div>
                      {isDropdownOpen && (
                        <div className="dropdown-options">
                          {field.options.map((option) => (
                            <div
                              key={option.id}
                              onClick={() => handleDropdownChange(option.label)}
                              className="option"
                            >
                              {option.label}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {field.type === "upload" && (
                  <div>
                    <>
                      <input
                        type="file"
                        id={field.id}
                        onChange={handleFieldChange}
                        accept={field.validation.allowed}
                        required={field.validation.required}
                        maxsize={field.validation.maximum_length}
                      />
                    </>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
        <div>
          {currentPage > 0 && (
            <button type="button" onClick={handlePrevious}>
              Previous page
            </button>
          )}
          {currentPage < totalPages - 1 && (
            <button type="submit" >
              Next page
            </button>
          )}
          {currentPage === totalPages - 1 && (
            <button type="submit">{page.actions[0].label}</button>
          )}
          <button type="button" onClick={handleCancel}>
            {page.actions[1].label}
          </button>
        </div>
      </form>
      {/* Display cancel confirmation dialog */}
      {isCancelConfirmationVisible && (
        <div className="overlay">
          <div className="confirmation">
            <p>{json.pages[1].actions[1].message}</p>
            <button onClick={() => handleCancelConfirmation(true)}>Yes</button>
            <button onClick={() => handleCancelConfirmation(false)}>No</button>
          </div>
        </div>
      )}
      {/* Display submit confirmation dialog */}
      {isSubmitConfirmationVisible && (
        <div className="overlay">
          <div className="confirmation">
            <p>{json.pages[1].actions[0].message}</p>
            <button onClick={() => handleSubmitConfirmation(true)}>Yes</button>
            <button onClick={() => handleSubmitConfirmation(false)}>No</button>
          </div>
        </div>
      )}
    </div>
  );
}
export default Form;