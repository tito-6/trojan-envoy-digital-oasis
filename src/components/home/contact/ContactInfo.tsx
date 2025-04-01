
import React from "react";

const ContactInfo: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="contact-info-item">
        <h3 className="text-lg font-semibold mb-2">Office Address</h3>
        <p className="text-muted-foreground">
          1234 Tech Avenue, Innovation District<br />
          New York, NY 10001, USA
        </p>
      </div>
      
      <div className="contact-info-item">
        <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
        <p className="text-muted-foreground">
          Email: contact@trojanenvoy.com<br />
          Phone: +1 (555) 123-4567
        </p>
      </div>
      
      <div className="contact-info-item">
        <h3 className="text-lg font-semibold mb-2">Working Hours</h3>
        <p className="text-muted-foreground">
          Monday - Friday: 9:00 AM - 6:00 PM<br />
          Saturday & Sunday: Closed
        </p>
      </div>
    </div>
  );
};

export default ContactInfo;
