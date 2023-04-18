# Easy Layers
Easy Layers is a public website that allows people to create Lambda Layers with Python packages, just like pip install. With Easy Layers, you create layers that keep your Lambda functions smaller and easier to manage by externalizing dependencies that can be shared across multiple functions.

# Getting Started
To use Lambda Layers Creator, simply navigate to the website in your browser at https://easylayers.dev/

# Creating a Lambda Layer
To create a Lambda Layer, follow these steps:

1. Enter the AWS Region, Python version, and architecture you want.
2. Enter the name of the Python package you want to include in your layer (e.g. requests, pandas, numpy, etc.).
3. Enter the version of the Python package (optional).
4. Click the "Submit" button to create a layer.

# After creating
If a previous layer was created you will see the ARN popup on your screen. You can copy and paste this into any lambda with the appropriate region.
If there is not an existing layer, it will be sent to a queue for processing. Layers can take up to 5 minutes to create. Please be patient for your layer to be created. Once it is created you will see a pop up message apprear on your screen with the layers arn. You can copy and paste that. It will also be on the https://easylayers.dev/layers don't worry if you don't get the message!

# How it Works
The source code on creating a layer is easy-layers/backend/functions/src/create_layer.py

Easy Layers uses the python subproces and pip package manager to install Python packages and create the Layer in AWS. When you add a package to your Layer, the website runs pip install <package-name> -t <temp-dir> in a lambda (no issues with architectures) to install the package and its dependencies in a temporary directory. Then, it zips the contents of the directory, publishes it to s3, and creates a layer in AWS.

Limitations
Lambda Layers Creator has the following limitations: 
1. There are libraries that throw errors with this lambda. We working on updates to try and allow for more layers.
2. It only supports Python packages that are available in the official Python Package Index (PyPI).
3. It only supports Python 3.8 , 3.9 (for now).
4. It does not support additional dependencies that are not installed through pip (e.g. system-level dependencies).
5. We are dependent on AWS. If lambda / s3 is down we will be too.
