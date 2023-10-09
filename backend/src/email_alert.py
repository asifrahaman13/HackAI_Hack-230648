import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import datetime
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

send_email = os.environ["SENDER_EMAIL"]
send_password = os.environ["EMAIL_API_PASSWORD"]


def send_email(
    receiver_email, message, sender_email=send_email, sender_password=send_password
):  
    body= "Hi! you have the following alert message:"
    body += "<br><br>"
    body += message
    body += "<br><br>"
    body += "<p>Thanks,</p>"
    body += "<p>Team Astra</p>"
    body += "</body></html>"

    # Set up the SMTP server
    # Change this if you're using a different email provider
    smtp_server = "smtp.gmail.com"
    smtp_port = 587  # Change this if required
    smtp_username = sender_email
    subject = "Currency exchange alert."

    # Create a multipart message and set the headers
    message = MIMEMultipart()
    # Attach the PDF file

    message["From"] = sender_email
    message["To"] = receiver_email
    message["Subject"] = (
        subject
        + " "
        + str(datetime.date.today())
        + " "
        + str(datetime.datetime.now().strftime("%H:%M"))
    )

    # Add body to the email as HTML content
    message.attach(MIMEText(body, "html"))

    try:
        # Login to the SMTP server
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(smtp_username, sender_password)

        # Send the email
        server.sendmail(sender_email, receiver_email, message.as_string())

        # Cleanup
        server.quit()

        print(f"Email sent successfully to {receiver_email}")
    except Exception as e:
        print("An error occurred while sending the email:", str(e))
