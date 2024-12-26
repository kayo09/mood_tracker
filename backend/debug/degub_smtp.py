import smtplib

server = smtplib.SMTP('smtp.hostinger.com', 587)
server.starttls()
server.login("your-email@example.com", "your-email-password")
print("Login successful!")
server.quit()
