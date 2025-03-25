
import React from "react";
import { Link } from "react-router-dom";
import { Linkedin, Twitter, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/lib/i18n";

interface TeamMemberProps {
  name: string;
  role: string;
  bio: string;
  delay: number;
}

const TeamMember: React.FC<TeamMemberProps> = ({ name, role, bio, delay }) => {
  return (
    <Card className={`overflow-hidden group hover:shadow-lg transition-all duration-300 should-animate delay-${delay}`}>
      <div className="aspect-square relative bg-secondary">
        <div className="absolute inset-0 flex items-center justify-center bg-muted-foreground/10">
          <span className="text-muted-foreground">Team Photo</span>
        </div>
      </div>
      
      <CardContent className="p-6">
        <h3 className="text-xl font-display font-bold mb-1">{name}</h3>
        <p className="text-primary text-sm font-medium mb-3">{role}</p>
        <p className="text-muted-foreground text-sm mb-4">{bio}</p>
        
        <div className="flex items-center gap-2 mt-4">
          <a 
            href="#" 
            className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <a 
            href="#" 
            className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <Twitter className="w-4 h-4" />
          </a>
          <a 
            href="#" 
            className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <Mail className="w-4 h-4" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

const TeamSection: React.FC = () => {
  const { t } = useLanguage();
  
  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "CEO & Founder",
      bio: "With over 15 years of experience in software development and digital strategy, Alex leads our team with vision and expertise.",
    },
    {
      name: "Sarah Chen",
      role: "CTO",
      bio: "Sarah brings cutting-edge technical knowledge and innovation to our development processes, ensuring top-quality solutions.",
    },
    {
      name: "Michael Rodriguez",
      role: "Creative Director",
      bio: "Michael's eye for design excellence and user experience has helped shape our distinctive approach to digital aesthetics.",
    },
    {
      name: "Emily Patel",
      role: "Marketing Director",
      bio: "Emily's strategic approach to digital marketing drives campaigns that deliver measurable results and exceptional ROI.",
    },
    {
      name: "David Kim",
      role: "Lead Developer",
      bio: "David's technical expertise and problem-solving abilities ensure our development projects are executed flawlessly.",
    },
    {
      name: "Jennifer Lewis",
      role: "UX/UI Designer",
      bio: "Jennifer creates intuitive, engaging interfaces that delight users while meeting business objectives.",
    },
    {
      name: "Robert Wilson",
      role: "SEO Specialist",
      bio: "Robert's deep understanding of search algorithms helps our clients achieve top rankings and increased visibility.",
    },
    {
      name: "Lisa Thompson",
      role: "Client Success Manager",
      bio: "Lisa ensures our clients receive exceptional service and support throughout their journey with us.",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12 should-animate">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Meet Our Team
          </h2>
          <p className="text-muted-foreground">
            The talented individuals behind our success, bringing diverse expertise 
            and shared passion to every project.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <TeamMember
              key={member.name}
              {...member}
              delay={index * 100}
            />
          ))}
        </div>
        
        <div className="mt-16 text-center should-animate">
          <h3 className="text-xl font-display font-bold mb-3">Join Our Team</h3>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            We're always looking for talented individuals to join our growing team. 
            Check out our current openings or send us your resume.
          </p>
          <Link
            to="/careers"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            View Open Positions
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
