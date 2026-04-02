# Use official Python 3.11 slim image as base
FROM python:3.11-slim

# Set working directory inside the container
WORKDIR /app

# Copy requirements first (Docker caches this layer)
# If requirements don't change, Docker won't reinstall packages on rebuild
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code
COPY . .

# Expose port 8000 so other containers and host can reach it
EXPOSE 8000

# Start FastAPI with uvicorn, --reload watches for file changes
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--reload"]

