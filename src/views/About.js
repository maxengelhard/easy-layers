import React from 'react';

const About = () => {
    return (
      <div>
        <h1>About Easy Layers</h1>
        <p>
        An AWS Layer is a package of libraries or dependencies that can be added to an AWS Lambda function. 
        This allows you to use famous libraries like requests, Django, BS4, etc.. 
        When you create a layer, you specify the package, region and optionally you can pick the version of the dependency that you want to include. We take 
        care of making the Layer and will give you the ARN. All you have to do is attach it to your lambda and AWS will make sure that the package is available to your function at runtime.
        As of now we have python 3.8,3.9 and in all available regions.
        </p>
      </div>
    );
  }

export default About;