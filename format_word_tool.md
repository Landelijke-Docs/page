# Introduction

This tool was made to allow people to automatically format .doc/.docx files to follow some of the style guidelines for readability.

This is will tool will change character, word, and line spacing to have:
    - Character spacing at 35% of font size 
    - Word spacing at 350% of character spacing
    - Line spacing at 150% of word spacing

# How to use it

In order to use it in your own word documents you need to take the following steps:

    -   Go to the "Developer" tab in your Word window
    -   If you don't have the Developer tab then first go to the "File" tab and select "options"
    -   Go to "Customize Ribbon" and make sure that the "Developer" check box is checked and press OK
    -   Click on "Macros", provide a name "Landelijke Docs styling tool" and press "create"
    -   Remove the placeholder text from the file that has opened and copy and paste one of the tools below into the window and save the file
    - Close the "Microsoft Visual Basic for Applications" window and you can access the macro from the Macros button and select "run" to use it

# Tools


## For selected text

Sub Change_selected_spacing()
    Dim fontSize As Integer
    Dim charSpacingPercentage As Integer
    Dim wordSpacingPercentage As Integer
    Dim lineSpacingPercentage As Integer
    Dim spacing As Integer
    
    ' Get the font size of the selected text
    fontSize = Selection.Font.Size
    
    charSpacingPercentage = 35
    wordSpacingPercentage = 350
    lineSpacingPercentage = 150
    
    ' Calculate inter-character spacing
    spacing = fontSize * (charSpacingPercentage / 100)
    
    ' Apply inter-character spacing
    Selection.Font.spacing = spacing
    
    ' Calculate inter-word spacing (based on inter-character spacing)
    spacing = spacing * (wordSpacingPercentage / 100)
    
    ' Calculate line spacing based on inter-word spacing
    spacing = spacing * (lineSpacingPercentage / 100)
    
    ' Apply line spacing
    Selection.ParagraphFormat.LineSpacing = spacing
End Sub

## For full document

Sub Change_doc_spacing()
    Dim doc As Document
    Dim rng As Range
    Dim para As Paragraph
    Dim fontSize As Double
    Dim charSpacingPercentage As Single
    Dim wordSpacingPercentage As Single
    Dim lineSpacingPercentage As Single
    Dim spacing As Double
    
    Application.ScreenUpdating = False
    Set doc = ActiveDocument
    
    char_spacing_percentage = 35
    word_spacing_percentage = 350
    line_spacing_percentage = 150
    
    
    For Each para In doc.Paragraphs
        For Each wd In para.Range.Words
            ' Get fontsize of paragraph
            font_size = wd.Font.Size
            
            ' Skip if font size is zero (to avoid errors)
            If fontSize <> 0 Then
                ' Calculate inter-character spacing
                spacing = fontSize * (charSpacingPercentage / 100)
                
                ' Apply inter-character spacing
                Selection.Font.spacing = spacing
            Else
                MsgBox "Word with font size 0 found. Skipping."
                
            End If
            
        Next wd
        
        ' Calculate inter-word spacing (based on inter-character spacing)
        spacing = spacing * (wordSpacingPercentage / 100)
                
        ' Calculate line spacing based on inter-word spacing
        spacing = spacing * (lineSpacingPercentage / 100)
                
        ' Apply line spacing
        Selection.ParagraphFormat.LineSpacing = spacing
        
    Next para
End Sub

# links
https://stackoverflow.com/questions/76221882/change-paragraph-font-size 
https://stackoverflow.com/questions/65153963/sub-to-find-text-in-a-word-document-by-specified-font-and-font-size
https://stackoverflow.com/questions/79934580/what-methods-can-i-use-to-provide-an-upload-page-on-a-static-github-pages-webs
https://learn.microsoft.com/en-us/office/vba/api/word.font.spacing
https://learn.microsoft.com/en-us/office/vba/api/word.paragraphs.format
https://learn.microsoft.com/en-us/office/vba/api/word.paragraph.range
