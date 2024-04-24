import { useState, FormEvent } from 'react';
import { ArrowPathIcon } from "@heroicons/react/24/outline"
import { Field, Form, Formik } from 'formik';
import Head from 'next/head';

interface FormData {
  email: string;
  password: string;
  title: string;
  body: string;
  recipient: string;
}
export default function Home() {
  const handleSubmit = async (values: FormData, { setSubmitting, resetForm }: any) => {
    console.log("Form values:", values);

    // Process line breaks into <br> tags for HTML email
    const processedFormData = {
      ...values,
      body: values.body.replace(/\n/g, '<br>')
    };

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(processedFormData)
      });
      const data = await response.json();
      if (response.ok) {
        alert('Email sent successfully!');
        console.log('Server response:', data);
        resetForm();  // Reset Formik form state
      } else {
        throw new Error(data.message || 'Failed to send email');
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
      console.error('Error sending email:', error);
    } finally {
      setSubmitting(false);  // Reset submission state
    }
  };

  return (
    <>
      <Head>
        <title>
          Send Emails - SMTP
        </title>
      </Head>
      <div className="flex justify-center py-12 px-5 h-screen items-start">
        <Formik
          initialValues={{
            email: '',
            password: '',
            title: '',
            body: '',
            recipient: ''
          }}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4 bg-white dark:bg-gray-950 shadow-white/5 shadow-md rounded px-8 pt-6 pb-8 mb-4 text-black dark:text-white w-full max-w-3xl">
            <h2 className='text-xl mb-4'>SMTP Info:</h2>
            <Field type="email" name="email" placeholder="Email" className="appearance-none block w-full bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none" />
            <Field type="password" name="password" placeholder="Password" className="appearance-none block w-full bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none" />
            <hr className="my-4" />
            <h2 className='text-xl mb-4'>Client Info:</h2>
            <Field type="email" name="recipient" placeholder="Recipient Email" className="appearance-none block w-full bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none" />
            <Field type="text" name="title" placeholder="Title" className="appearance-none block w-full bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none" />
            <Field as="textarea" name="body" placeholder="HTML Body" className="appearance-none block w-full bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none" />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 w-full hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {isSubmitting ? <ArrowPathIcon width={30} className="animate-spin" /> : "Send"}
            </button>
          </Form>
          )}
        </Formik>
      </div>
    </>
  );
};
