
import streamlit as st

st.set_page_config(page_title="Bhagwatam Assistant", page_icon="📖")

st.title("📖 Bhagwatam Assistant")
st.write("Ask questions about Srimad Bhagavatam.")

question = st.chat_input("Ask your question here...")

if question:
    st.chat_message("user").write(question)
    with st.chat_message("assistant"):
        st.write(
            "You asked: " + question
        )
        st.info(
            "Connect your Bhagwatam RAG backend here "
            "to generate answers from the scripture."
        )
