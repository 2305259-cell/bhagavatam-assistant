
import streamlit as st
from backend.rag import retrieve_context
from backend.llm import generate_answer

st.set_page_config(
    page_title="Bhagwatam Assistant",
    page_icon="📖"
)

st.title("📖 Bhagwatam Assistant")
st.write("Ask questions about Srimad Bhagavatam.")

if "messages" not in st.session_state:
    st.session_state.messages = []

for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

question = st.chat_input("Ask your question here...")

if question:
    st.session_state.messages.append(
        {"role": "user", "content": question}
    )

    with st.chat_message("user"):
        st.markdown(question)

    with st.chat_message("assistant"):
        with st.spinner("Searching Bhagavatam..."):
            try:
                passages = retrieve_context(
                    question,
                    number_of_results=3
                )

                if isinstance(passages, str):
                    context_text = passages
                else:
                    context_text = str(passages)

                if not context_text.strip():
                    answer = (
                        "I could not find a relevant passage "
                        "in the Bhagavatam database."
                    )
                else:
                    answer = generate_answer(
                        question,
                        context_text
                    )

                st.markdown(answer)

            except Exception as e:
                st.error(
                    "Something went wrong. Check your backend "
                    "files, database and API key."
                )
                st.caption(str(e))
                answer = None

    if answer is not None:
        st.session_state.messages.append(
            {"role": "assistant", "content": answer}
        )
