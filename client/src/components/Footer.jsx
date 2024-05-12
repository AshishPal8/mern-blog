import { Link } from "react-router-dom";
import { Footer } from "flowbite-react";
import {
  BsFacebook,
  BsLinkedin,
  BsTwitter,
  BsInstagram,
  BsGithub,
} from "react-icons/bs";

const FooterPage = () => {
  return (
    <Footer className="border dark:bg-[#121430] border-t-8 border-teal-500 p-8">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid justify-between items-center gap-4 sm:gap-0 sm:flex md:grid-cols-1">
          <div>
            <Link
              to="/"
              className="self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white"
            >
              Ashish Blog
            </Link>
          </div>
          <div className="flex flex-wrap gap-5">
            <div>
              <Footer.Title title={"About"} />
              <Footer.LinkGroup col>
                <Footer.Link href="/" target="_blank">
                  Projects
                </Footer.Link>
              </Footer.LinkGroup>
              <Footer.LinkGroup col>
                <Footer.Link href="/" target="_blank">
                  Ashish Blogs
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title={"Follow Us"} />
              <Footer.LinkGroup col>
                <Footer.Link href="/" target="_blank">
                  Gitub
                </Footer.Link>
              </Footer.LinkGroup>
              <Footer.LinkGroup col>
                <Footer.Link href="/" target="_blank">
                  Linkedin
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title={"Legal"} />
              <Footer.LinkGroup col>
                <Footer.Link href="/" target="_blank">
                  Privacy Policy
                </Footer.Link>
              </Footer.LinkGroup>
              <Footer.LinkGroup col>
                <Footer.Link href="/" target="_blank">
                  Term and Condition
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full flex justify-between items-center flex-col sm:flex-row">
          <Footer.Copyright
            href="#"
            by="Ashish Blogs"
            year={new Date().getFullYear()}
          />
          <div className="flex items-center justify-center gap-3 mt-4 sm:mt-0">
            <Footer.Icon href="#" icon={BsFacebook} />
            <Footer.Icon href="#" icon={BsLinkedin} />
            <Footer.Icon href="#" icon={BsTwitter} />
            <Footer.Icon href="#" icon={BsInstagram} />
            <Footer.Icon href="#" icon={BsGithub} />
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default FooterPage;
