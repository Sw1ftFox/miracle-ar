type PropsType = {
  styles: CSSModuleClasses;
  title: string;
  id: string;
  type: string;
  accept: string;
  required: boolean;
  submitText: string;
};

const Section = ({
  styles,
  title,
  id,
  type,
  accept,
  required,
  submitText,
}: PropsType) => {
  return (
    <div id={id}>
      <h2>{title}</h2>
      <div id="model-list" className={styles.file__list}></div>

      <form className={styles.upload__form}>
        <input
          type={type}
          className={styles.upload__btn}
          accept={accept}
          required={required}
        />
        <button type="submit" className={styles.btn}>
          {submitText}
        </button>
      </form>
    </div>
  );
};

export default Section;
