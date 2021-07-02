import { useEditor, EditorContent, Editor } from '@tiptap/react'
import sanitizeHtml from 'sanitize-html'
import StarterKit from '@tiptap/starter-kit'
import { Button } from 'antd'
import debounce from 'lodash.debounce'
import {
  BoldOutlined,
  ItalicOutlined,
  RedoOutlined,
  StrikethroughOutlined,
  UndoOutlined,
} from '@ant-design/icons'
import { useEffect, useState } from 'react'

interface ContentEditorProps {
  content: string
  updateFunction: Function
  entityId: number
  disabled: boolean
}

const sanitize = (html: string) => {
  return sanitizeHtml(html, {
    allowedTags: ['p', 'em', 'i', 'h1', 'h2', 'h3', 'strong', 'a', 'div'],
    allowedAttributes: {
      a: ['href'],
    },
    allowedIframeHostnames: ['www.youtube.com', 'www.vimeo.com'],
  })
}

// just for display when disabled
const DisabledMenuBar = () => {
  return (
    <>
      <Button disabled>clear</Button>
      <Button icon={<BoldOutlined />} disabled />
      <Button icon={<ItalicOutlined />} disabled />
      <Button icon={<StrikethroughOutlined />} disabled />
      <Button disabled>paragraph</Button>
      <Button disabled>h1</Button>
      <Button disabled>h2</Button>
      <Button disabled>h3</Button>
      <Button disabled>horizontal rule</Button>
      <Button disabled icon={<UndoOutlined />} />
      <Button disabled icon={<RedoOutlined />} />
    </>
  )
}

const MenuBar = ({ editor }: { editor: Editor }) => {
  return (
    <>
      <Button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
        clear
      </Button>
      <Button
        icon={<BoldOutlined />}
        onClick={() => editor.chain().focus().toggleBold().run()}
        type={editor.isActive('bold') ? 'primary' : 'default'}
      />
      <Button
        icon={<ItalicOutlined />}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        type={editor.isActive('italic') ? 'primary' : 'default'}
      />
      <Button
        icon={<StrikethroughOutlined />}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        type={editor.isActive('strike') ? 'primary' : 'default'}
      />
      <Button
        onClick={() => editor.chain().focus().setParagraph().run()}
        type={editor.isActive('paragraph') ? 'primary' : 'default'}
      >
        paragraph
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        type={editor.isActive('heading', { level: 1 }) ? 'primary' : 'default'}
      >
        h1
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        type={editor.isActive('heading', { level: 2 }) ? 'primary' : 'default'}
      >
        h2
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        type={editor.isActive('heading', { level: 3 }) ? 'primary' : 'default'}
      >
        h3
      </Button>
      <Button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        horizontal rule
      </Button>
      <Button
        icon={<UndoOutlined />}
        onClick={() => editor.chain().focus().undo().run()}
      />
      <Button
        icon={<RedoOutlined />}
        onClick={() => editor.chain().focus().redo().run()}
      />
    </>
  )
}

export const ContentEditor = (props: ContentEditorProps) => {
  const { entityId } = props
  // @ts-ignore
  const handleChange = debounce((html) => props.updateFunction(html), 1500, {
    maxWait: 6000,
  })

  const editor = useEditor(
    {
      extensions: [StarterKit],
      editable: true,
      injectCSS: false,
      content:
        props.content ||
        `<h3>No Description</h3><br><span>Log In to add one.</span>`,
      onUpdate: ({ editor }) => {
        handleChange(sanitize(editor.getHTML()))
      },
    },
    [entityId]
  )

  return (
    <>
      {!!editor && (
        <>
          {props.disabled ? (
            <>
              <DisabledMenuBar />
              <div dangerouslySetInnerHTML={{ __html: props.content }} />
            </>
          ) : (
            <>
              <MenuBar editor={editor} />
              <EditorContent
                disabled={props.disabled}
                editor={editor}
                style={{ marginTop: 24 }}
              />
            </>
          )}
        </>
      )}
    </>
  )
}
