// import { Controller } from 'react-hook-form';
// import { Editor } from '@tinymce/tinymce-react';
// import { FiType } from 'react-icons/fi';

// export default function RTE({ name, control, label, defaultValue = "" }) {
//   return (
//     <div className="w-full">
//       {label && (
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           <FiType className="inline mr-1" />
//           {label}
//         </label>
//       )}
      
//       <Controller
//         name={name || "content"}
//         control={control}
//         defaultValue={defaultValue}
//         rules={{ required: "Content is required" }}
//         render={({ field: { onChange, value } }) => (
//           <Editor
//             apiKey="9dig9m54kezmtsy62zutk74ynibkgfp8j83kfjrprw0ih9uj"
//             value={value}
//             onEditorChange={onChange}
//             init={{
//               height: 500,
//               menubar: true,
//               plugins: [
//                 "advlist autolink lists link image charmap print preview anchor",
//                 "searchreplace visualblocks code fullscreen",
//                 "insertdatetime media table paste code help wordcount"
//               ],
//               toolbar:
//                 "undo redo | formatselect | bold italic backcolor | \
//                 alignleft aligncenter alignright alignjustify | \
//                 bullist numlist outdent indent | removeformat | help | image",
//               images_upload_handler: async (blobInfo, success) => {
//                 // You would implement your own image upload handler here
//                 success('https://via.placeholder.com/600x400');
//               },
//               content_style: "body { font-family: 'Inter', sans-serif; font-size: 16px; line-height: 1.6; }",
//               skin: 'oxide',
//               icons: 'thin',
//               branding: false
//             }}
//           />
//         )}
//       />
//     </div>
//   );
// }
import React from 'react'
import {Editor } from '@tinymce/tinymce-react';
import {Controller } from 'react-hook-form';


export default function RTE({name, control, label, defaultValue =""}) {
  return (
    <div className='w-full'> 
    {label && <label className='inline-block mb-1 pl-1'>{label}</label>}

    <Controller
    name={name || "content"}
    control={control}
    render={({field: {onChange}}) => (
        <Editor
        apiKey="9dig9m54kezmtsy62zutk74ynibkgfp8j83kfjrprw0ih9uj"
        initialValue={defaultValue}
        init={{
            initialValue: defaultValue,
            height: 500,
            menubar: true,
            plugins: [
                "image",
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "code",
                "help",
                "wordcount",
                "anchor",
            ],
            toolbar:
            "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |removeformat | help",
            content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }"
        }}
        onEditorChange={onChange}
        />
    )}
    />

     </div>
  )
}

